export function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
};

export function escapeHtml(text: string) {
    return text
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }