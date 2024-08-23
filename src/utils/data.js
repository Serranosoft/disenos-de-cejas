export const categories_raw = [
    {
        name: "Tipos de cejas",
        steps: 4,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-tipos-de-cejas-2.jpg",
    },
    {
        name: "Diseños de cejas",
        steps: 3,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-disenos-de-cejas-1.jpg",
    },
    {
        name: "Como hacer mis cejas",
        steps: 4,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-como-hacer-mis-cejas-2.jpg",
    },
    {
        name: "Como pintar mis cejas",
        steps: 3,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-como-pintar-mis-cejas-3.jpg",
    },
]

export async function fetchImages(category, length) {
    const images = [];
    let result = "";
    
    const urlSegment = "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-"
    const patternWithoutÑ = category.replace("ñ", "n");
    const pattern = patternWithoutÑ.replace(/ /g, '-').toLowerCase();  

    for (let i = 1; i <= length; i++) {
        result = urlSegment + pattern + "-" + i +".jpg"
        images.push(result);
    }

    return images;
}