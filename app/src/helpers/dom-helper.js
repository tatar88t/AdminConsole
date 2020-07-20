export default class DOMHelper {
    static parseStringToDom(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");

    }

    static wrapTextNodes(dom) {
        const body = dom.body;
        let textNodes =[]
        function recursionParse(element) {
            element.childNodes.forEach(node => {
                console.log(node)
                if (node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0) {
                    textNodes.push(node);
                } else {
                    recursionParse(node);
                }
            })

        }
        recursionParse(body)

        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute('nodeid', i);

        })
        return dom;
    }
    static serializeDOMToString(dom) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    static unwrapTextNodes(dom) {
        dom.body.querySelectorAll('text-editor').forEach(element => {
            element.parentNode.replaceChild(element.firstChild, element);
        })
    }
}