export class SelectedColor {
    constructor(color) {
        this.color = color;
    }
}

export class ColorPicker {
    constructor(name, type, color, selectedClr) {
        this.name = name;
        this.type = type;
        this.color = color;
        this.div = document.createElement("div");
        this.colorButton = document.createElement("button");
        this.selectedClr = selectedClr;
        this.generate();
    }

    generate() {
        this.div.classList.add(`menu-color-container`);

        let colorTitle = document.createElement("h1");
        colorTitle.classList.add(`menu-color-header`);
        colorTitle.innerText = this.name;
        this.div.appendChild(colorTitle);

        this.colorButton.classList.add(`menu-color-button`);
        this.colorButton.style.backgroundColor = this.color;
        const cPicker = this;
        this.colorButton.addEventListener("click", function() {
            cPicker.onClick();
        });
        this.div.appendChild(this.colorButton);
    }

    onClick() {
        this.selectedClr.color = this.type;
    }
}
