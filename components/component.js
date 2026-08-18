class Component extends HTMLElement {

    async connectedCallback() {
        if (this._loaded)
            return;

        this._loaded = true;

        await this.load(this.scriptUrl);

        this.connected();
    }

    async load(scriptUrl) {
        const directory = new URL(".", scriptUrl);

        const templateUrl = new URL(
            "template.html",
            directory
        );

        const styleUrl = new URL(
            "style.css",
            directory
        );

        // Load HTML
        const templateResponse = await fetch(templateUrl);
        const templateHtml = await templateResponse.text();

        const document = new DOMParser()
            .parseFromString(templateHtml, "text/html");

        const template = document.querySelector("template");

        if (!template)
            throw new Error(
                `template.html does not contain a <template>`
            );

        // Load CSS
        const styleResponse = await fetch(styleUrl);
        const styleText = await styleResponse.text();

        const style = document.createElement("style");
        style.textContent = styleText;

        // Add component
        this.appendChild(style);
        this.appendChild(
            template.content.cloneNode(true)
        );
    }

    connected() {
        // Override
    }
}

export default Component;