export default function (text: string) {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length), document.execCommand("Copy");
    document.body.removeChild(input);
}
