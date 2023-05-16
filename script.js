stageWidth = 640;
stageHeight = 640;

const stage = new Konva.Stage({
  container: "canvasContainer",
  width: stageWidth,
  height: stageHeight,
});

const bgLayer = new Konva.Layer({
  listening: false,
});

const layer = new Konva.Layer();

let transformer = new Konva.Transformer({
  nodes: [],
  resizeEnabled: true,
  rotateEnabled: true,
  padding: 4,
  borderStrokeWidth: 2,
  centeredScaling: true,
});

layer.add(transformer);

stage.add(bgLayer, layer);

layer.draw();

let targetShape = null;

layer.on("click", (e) => {
  !(e.target.getClassName() == "Image" || e.target.getClassName() == "Text");
  targetShape = e.target;
  transformer.nodes([e.target]);
  targetShape.moveToTop();
  transformer.moveToTop();
});

layer.on("mouseenter", () => {
  stage.container().style.cursor = "pointer";
});

layer.on("mouseleave", () => {
  stage.container().style.cursor = "default";
});

stage.on("click", function (e) {
  if (e.target === stage) {
    transformer.nodes([]);
    targetShape = null;
  }
});

document.getElementById("textAddButton").addEventListener("click", () => {
  let element = document.getElementById("text");

  const text = new Konva.Text({
    x: stageWidth / 2,
    y: stageHeight / 2,
    fontSize: 40,
    text: element.value,
    align: "center",
    fontStyle: "bold",
    draggable: true,
  });

  text.offsetX(text.width() / 2);
  text.offsetY(text.height() / 2);
  layer.add(text);
  transformer.nodes([text]);
  targetShape = text;
  element.value = "";
});

document.getElementById("biggerButton").addEventListener("click", () => {
  if (targetShape) {
    targetShape.scaleX(targetShape.scaleX() * 1.1);
    targetShape.scaleY(targetShape.scaleY() * 1.1);
  }
});

document.getElementById("smallerButton").addEventListener("click", () => {
  if (targetShape) {
    targetShape.scaleX(targetShape.scaleX() * 0.9);
    targetShape.scaleY(targetShape.scaleY() * 0.9);
  }
});

document.getElementById("rightRotateButton").addEventListener("click", () => {
  if (targetShape) {
    targetShape.rotate(15);
  }
});

document.getElementById("leftRotateButton").addEventListener("click", () => {
  if (targetShape) {
    targetShape.rotate(-15);
  }
});

document.getElementById("toUpButton").addEventListener("click", () => {
  if (targetShape) {
    targetShape.moveUp();
  }
});

document.getElementById("toDownButton").addEventListener("click", () => {
  if (targetShape) {
    targetShape.moveDown();
  }
});

document.getElementById("destroyButton").addEventListener("click", () => {
  if (targetShape) {
    transformer.nodes([]);
    targetShape.destroy();
    targetShape = null;
  }
});

const stampContainers = document.getElementsByClassName(
  "item-panel__stamp-container"
);

for (let stampContainer of stampContainers) {
  stampContainer.addEventListener("click", (e) => {
    let imageObj = new Image();

    imageObj.onload = function () {
      const stamp = new Konva.Image({
        x: stageWidth / 2,
        y: stageHeight / 2,
        image: imageObj,
        width: 100,
        height: 100,
        offsetX: 50,
        offsetY: 50,
        scaleX: 1,
        scaleY: 1,
        draggable: true,
      });

      layer.add(stamp);
      targetShape = stamp;
      transformer.nodes([stamp]);
    };

    imageObj.src = e.target.children[0].src;
  });
}

const colorsStageWidth = 380;
const colorsStageHeight = 148;
const colors = [
  "#C56770", "#BB3E53", "#C2383F", "#80413D", "#E05645",
  "#AD4E39", "#7C5642", "#57453A", "#FF8944", "#FCA63B",
  "#9F6C31", "#B98744", "#847461", "#FBBD2D", "#FBE28B",
  "#F3D425", "#F2E760", "#94A639", "#457731", "#51653C",
  "#008954", "#3AB178", "#235D50", "#2C6A4B", "#80A58F",
  "#319DA6", "#006A68", "#005E6C", "#5EA5C4", "#6AA0D5",
  "#436BA1", "#244974", "#5E83BC", "#005394", "#A293CC",
  "#7B6EA2", "#6A4183", "#9D759C", "#4A3F75", "#94445E",
  "#643C51", "#D882A5", "#E1E2E2", "#8F8F8F", "#767676",
  "#3E3E3E",
];

const colorPaletteStage = new Konva.Stage({
  container: "colorsCanvasContainer",
  width: colorsStageWidth,
  height: colorsStageHeight,
});

const colorsLayer = new Konva.Layer();

colors.map((color, index) => {
  let circle = new Konva.Circle({
    x: 10 + 40 * (index % 10),
    y: 10 + 32 * Math.floor(index / 10),
    radius: 10,
    fill: color,
    draggable: false,
  });

  colorsLayer.add(circle);
});

colorPaletteStage.add(colorsLayer);

colorsLayer.on("mousedown", (e) => {
  if (targetShape == null || targetShape.getClassName() != "Text") return;
  targetShape.fill(e.target.fill());
});

colorsLayer.on("mouseenter", () => {
  colorPaletteStage.container().style.cursor = "pointer";
});

colorsLayer.on("mouseleave", () => {
  colorPaletteStage.container().style.cursor = "default";
});

document.getElementById("fileUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  let imageObj = new Image();
  imageObj.onload = () => {
    const photo = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
    });

    updateSize(photo, imageObj);

    bgLayer.add(photo);
  };

  reader.addEventListener(
    "load",
    () => {
      imageObj.src = reader.result;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }

  document.getElementById("startScreen").style.display = "none";
});

const updateSize = (photo, imageObj) => {
 
  const photoRatio = imageObj.naturalWidth / imageObj.naturalHeight;
  let newWidth;
  let newHeight;

  if (1 >= photoRatio) {
    newWidth = stageWidth * photoRatio;
    newHeight = stageHeight;
  } else {
    newWidth = stageWidth;
    newHeight = stageHeight / photoRatio;
  }

  stageWidth = newWidth;
  stageHeight = newHeight;

  stage.width(stageWidth);
  stage.height(stageHeight);

  photo.width(newWidth);
  photo.height(newHeight);
};

const downloadURI = (uri, name) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
};

document.getElementById("saveButton").addEventListener("click", () => {
  const dataURL = stage.toDataURL({ pixelRatio: 3 });
  downloadURI(dataURL, "stage.jpeg");
});
