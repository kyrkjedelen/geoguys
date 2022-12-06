const INFO_BOX = document.querySelector("#info-box") as HTMLDivElement;

export function resetInfoBox(name: string, description: string) {
    const nameElement = document.createElement("h1");
    const descriptionElement = document.createElement("p");

    INFO_BOX.append(nameElement, descriptionElement);
}