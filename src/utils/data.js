export const categories_raw = [
    {
        id: "laminated",
        name_key: "tutorial_laminated",
        fetch_name: "Tutorial cejas laminadas",
        steps: 5,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-tutorial-cejas-laminadas-1.jpg",
    },
    {
        id: "define",
        name_key: "tutorial_define",
        fetch_name: "Tutorial definir cejas",
        steps: 5,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-tutorial-definir-cejas-1.jpg",
    },
    {
        id: "paint",
        name_key: "tutorial_paint_tutorial",
        fetch_name: "Tutorial pintar cejas",
        steps: 5,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-tutorial-pintar-cejas-1.jpg",
    },
    {
        id: "types",
        name_key: "tutorial_types",
        fetch_name: "Tipos de cejas",
        steps: 4,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-tipos-de-cejas-2.jpg",
    },
    {
        id: "designs",
        name_key: "tutorial_designs",
        fetch_name: "Diseños de cejas",
        steps: 3,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-disenos-de-cejas-1.jpg",
    },
    {
        id: "how_to",
        name_key: "tutorial_how_to",
        fetch_name: "Como hacer mis cejas",
        steps: 4,
        image: "https://mollydigital.manu-scholz.com/wp-content/uploads/2023/10/guia-como-hacer-mis-cejas-2.jpg",
    },
    {
        id: "how_to_paint",
        name_key: "tutorial_how_to_paint",
        fetch_name: "Como pintar mis cejas",
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
        result = urlSegment + pattern + "-" + i + ".jpg"
        images.push(result);
    }

    return images;
}