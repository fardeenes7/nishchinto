"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
    createSocialConnection,
    disconnectSocialConnection,
    startSocialOAuth,
    handleSocialOAuthCallback,
} from "@/lib/api";

export async function createSocialConnectionAction(formData: FormData) {
    const shopId = String(formData.get("shopId") || "");
    const pageId = String(formData.get("pageId") || "");
    const pageName = String(formData.get("pageName") || "");
    const accessToken = String(formData.get("accessToken") || "");
    const expiresInRaw = formData.get("expiresIn");

    if (!shopId || !pageId || !pageName || !accessToken) {
        return;
    }

    const expiresIn = expiresInRaw ? Number(expiresInRaw) : undefined;

    const res = await createSocialConnection(shopId, {
        provider: "META",
        page_id: pageId,
        page_name: pageName,
        access_token: accessToken,
        ...(Number.isFinite(expiresIn) ? { expires_in: expiresIn } : {}),
    });

    if (!res.success) {
        return;
    }

    revalidatePath("/settings/social");
    revalidatePath("/products");
}

export async function disconnectSocialConnectionAction(formData: FormData) {
    const shopId = String(formData.get("shopId") || "");
    const connectionId = String(formData.get("connectionId") || "");

    if (!shopId || !connectionId) {
        return;
    }

    const res = await disconnectSocialConnection(shopId, connectionId);
    if (!res.success) {
        return;
    }

    revalidatePath("/settings/social");
    revalidatePath("/products");
}

export async function startSocialOAuthAction(formData: FormData) {
    const shopId = String(formData.get("shopId") || "");
    if (!shopId) return;

    const res = await startSocialOAuth(shopId);
    if (!res.success || !res.data.auth_url) {
        return;
    }

    redirect(res.data.auth_url);
}

export async function completeSocialOAuthSelectionAction(formData: FormData) {
    const shopId = String(formData.get("shopId") || "");
    const oauthState = String(formData.get("oauthState") || "");
    const selectedPageId = String(formData.get("selectedPageId") || "");
    if (!shopId || !oauthState || !selectedPageId) return;

    const res = await handleSocialOAuthCallback(shopId, {
        oauth_state: oauthState,
        selected_page_id: selectedPageId,
    });
    if (!res.success) return;

    revalidatePath("/settings/social");
    revalidatePath("/products");
}
