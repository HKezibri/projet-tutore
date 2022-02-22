//document.querySelector("#start").addEventListener("click", save)
let objGo = go.GraphObject.make;
let myDiagram = objGo(go.Diagram, "myDiagramDiv",
    {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
        allowZoom: false,
        "grid.visible": false,
        "commandHandler.copiesTree": true,
        "commandHandler.deletesTree": true,
        "draggingTool.dragsTree": false,
    });


let myModel = objGo(go.GraphLinksModel);
myModel.nodeDataArray = [
    { key: "EG" },
    { key: "ED" },
    { key: "MG" },
    { key: "MD" },
];

myModel.linkDataArray =
    [
        { from: "EG", to: "MG", poid: "w1", text: 10 },
        { from: "EG", to: "MD", poid: "w2", text: 0 },
        { from: "ED", to: "MG", poid: "w3", text: 0 },
        { from: "ED", to: "MD", poid: "w4", text: 10 },
    ];

myDiagram.model = myModel;

let linkSelectionAdornmentTemplate =
    objGo(go.Adornment, "Link",
        objGo(go.Shape,
            // isPanelMain declares that this Shape shares the Link.geometry
            { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })
    );

myDiagram.linkTemplate =
    objGo(go.Link,
        { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
        { relinkableFrom: true, relinkableTo: true, reshapable: true },
        {
            toShortLength: 4
        },
        new go.Binding("points").makeTwoWay(),
        objGo(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 }),
        objGo(go.Shape,  // the arrowhead
            { toArrow: "Standard", stroke: null }),
        objGo(go.Panel, "Auto",
            new go.Binding("visible", "null").ofObject(),
            objGo(go.Shape, "RoundedRectangle",  // the link shape
                { fill: "#F8F8F8", stroke: null }),
            objGo(go.TextBlock,
                {
                    textAlign: "center",
                    font: "10pt helvetica, arial, sans-serif",
                    stroke: "black",
                    margin: 2,
                    minSize: new go.Size(10, NaN),
                    editable: true,
                    
                },
                new go.Binding("text").makeTwoWay())
        )
    );


myDiagram.addDiagramListener("Modified", function() {
    let button = document.getElementById("start");
    if (button) button.disabled = !myDiagram.isModified;
    let idx = document.title.indexOf("*");
    if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
    } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
    }
});


//let nono = new Robot(1, 2, 3);

function get_nn_parameter() {
    let linkDataArray = JSON.parse(myDiagram.model.toJson()).linkDataArray;
    let w1 = linkDataArray[0].text
    let w2 = linkDataArray[1].text
    let w3 = linkDataArray[2].text
    let w4 = linkDataArray[3].text
    //set_nn_parameter([w1, w2, w3, w4]);
    return [w1, w2, w3, w4]
}

/*
function save(EG, ED) {
    let linkDataArray = JSON.parse(myDiagram.model.toJson()).linkDataArray;
    let w1 = linkDataArray[0].text
    let w2 = linkDataArray[1].text
    let w3 = linkDataArray[2].text
    let w4 = linkDataArray[3].text

    return [calculerMG(EG, ED, w1, w3), calculerMD(EG, ED, w2, w4)]
}



function calculerMG(EG, ED, w1, w3){
    return Math.tanh(w1 * EG + w3 * ED) ;
}


function calculerMD(EG, ED, w2, w4){
    return  Math.tanh(w2 * EG + w4 * ED);
}

 */




