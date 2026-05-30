import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

function getFileExtension(file) {
  const mimeMap = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
  };

  if (file?.type && mimeMap[file.type]) {
    return mimeMap[file.type];
  }

  const fromName = file?.name?.split(".").pop()?.toLowerCase();

  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) {
    return fromName;
  }

  return "jpg";
}

function createSafeStoragePath(file) {
  const extension = getFileExtension(file);
  const random =
    window.crypto && crypto.randomUUID
      ? crypto.randomUUID().replaceAll("-", "")
      : String(Date.now());

  return `payment-proof-${Date.now()}-${random}.${extension}`;
}

export async function createOrder({
  customerName,
  whatsappNumber,
  total,
  cart,
  paymentProofFile
}) {
  if (!isSupabaseConfigured) {
    return {
      id: `local-${Date.now()}`,
      payment_proof_path: null,
      paymentProofUrl: null
    };
  }

  const orderId =
    window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

  let paymentProofPath = null;
  let paymentProofUrl = null;

  if (paymentProofFile) {
    paymentProofPath = createSafeStoragePath(paymentProofFile);

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(paymentProofPath, paymentProofFile, {
        cacheControl: "3600",
        contentType: paymentProofFile.type || "image/jpeg",
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Payment proof upload failed: ${uploadError.message}`);
    }

    const { data: publicData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(paymentProofPath);

    paymentProofUrl = publicData?.publicUrl || null;
  }

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: customerName,
    whatsapp_number: whatsappNumber || null,
    total,
    status: "pending",
    payment_proof_path: paymentProofPath
  });

  if (orderError) {
    throw new Error(`Order save failed: ${orderError.message}`);
  }

  const items = cart.map((item) => ({
    order_id: orderId,
    product_id: String(item.id),
    name: item.name,
    variant: item.variant,
    qty: item.qty,
    price: item.price,
    notes: item.notes || null
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(items);

  if (itemsError) {
    throw new Error(`Order items save failed: ${itemsError.message}`);
  }

  return {
    id: orderId,
    payment_proof_path: paymentProofPath,
    paymentProofUrl
  };
}
