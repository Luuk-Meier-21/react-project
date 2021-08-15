export default function renderPartText(part, c) {


    //30px is default font size
    var fontsize = 30;
    //arial is default font family
    var fontfamily = part.render.text.family || "Arial"; 
    //white text color by default
    var color = part.render.text.color || "#FFFFFF";

    if(part.render.text.size)
        fontsize = part.render.text.size;
    else if(part.circleRadius)
        fontsize = part.circleRadius/2;

    var content = "";
    if(typeof part.render.text == "string")
        content = part.render.text;
    else if(part.render.text.content)
        content = part.render.text.content;
    
    // c.save();
    // c.rotate(part.angle);

    // c.textBaseline="middle";
    // c.textAlign="center";
    // c.fillStyle=color;
    // c.font = fontsize+'px '+fontfamily;
    // c.fillText(content, part.position.x, part.position.y);
    // c.restore();
}