
export async function uploadToImageKit(
    fileBase64: string,
    fileName: string,
    folder?: string,
    IMAGEKIT_PRIVATE_KEY?: string,
    IMAGEKIT_PUBLIC_KEY?: string
) {
    const auth = btoa(IMAGEKIT_PUBLIC_KEY + ':' + IMAGEKIT_PRIVATE_KEY);

    const form = new FormData();
    form.set('file', fileBase64);
    form.set('fileName', fileName);
    if (folder) form.set('folder', folder);

    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
        },
        body: form,
    });

    if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
    return await res.json();
}
