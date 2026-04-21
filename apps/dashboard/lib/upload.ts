/**
 * Client-side upload helpers.
 */
export async function uploadFileToS3(url: string, file: File) {
    const res = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    });
    return res;
}

