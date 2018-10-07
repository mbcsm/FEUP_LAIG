var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var ILLUMINATION_INDEX = 1;
var LIGHTS_INDEX = 2;
var TEXTURES_INDEX = 3;
var MATERIALS_INDEX = 4;
var NODES_INDEX = 5;
var MATERIAL_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;


var VIEWS_INDEX = 0;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;


        this.referenceLength;
        this.root;
        this.perspective = [];
        this.near;
        this.far;
        this.ambient = [];
        this.background = [];
        this.spot = [];
        this.omni = [];
        this.textures = [];
        this.materials = [];
        this.primitives = [];
        this.transforms=[];
        this.components = [];



        this.nodes = [];

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
        
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";


        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }
        //<views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }
        //<ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        //textures
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <textures> out of order");
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }
        //<material>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIAL_INDEX)
                this.onXMLMinorError("tag <materials> out of order");
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        //transformations
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <tranformations> out of order");
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        //<primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        //<components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <Scene> block.
     */
    parseScene(sceneNode) {
        this.root = this.reader.getString(sceneNode, 'root');
        this.referenceLength = this.reader.getFloat(sceneNode, 'axis_length');

        this.scene.referenceLength = this.referenceLength;

        this.log("Scene Parsed");

        return null;
    }
    /**
     * Parses the <views> block.
     */
    parseViews(viewsNodes) {

        var perspectiveElements = viewsNodes.getElementsByTagName('perspective');


        for (let perspectiveElement of perspectiveElements) {
            var id = this.reader.getString(perspectiveElement, 'id');
            var near = this.reader.getFloat(perspectiveElement, 'near');
            var far = this.reader.getFloat(perspectiveElement, 'far');
            var angle = this.reader.getFloat(perspectiveElement, 'angle');

            //TODO: Write geCoords Function
            var from = this.getCoords(perspectiveElement.getElementsByTagName('from')[0]);
            var to = this.getCoords(perspectiveElement.getElementsByTagName('to')[0]);

            var vecFrom = new vec3.fromValues(from.xCoord, from.yCoord, from.zCoord);
            var vecTo = new vec3.fromValues(to.xCoord, to.yCoord, to.zCoord);

            var camera = new CGFcamera(angle * DEGREE_TO_RAD,
                near,
                far,
                vecFrom,
                vecTo);

            this.perspective.push(camera);

            this.near = near;
            this.far = far;
        }

        this.log("views parsed");
    }

    /* parses the <ambient> block */
    parseAmbient(ambientNodes) {

        var ambientChild = ambientNodes.getElementsByTagName('ambient')[0];
        var backgroundChild = ambientNodes.getElementsByTagName('background')[0];

        this.background = this.getRGBArray(ambientChild);
        this.ambient = this.getRGBArray(backgroundChild);

        this.log("ambient Parsed");
    }
    /* parses the <lights> block */
    parseLights(LightNodes) {

        var omniNodes = LightNodes.getElementsByTagName('omni');
        var spotNodes = LightNodes.getElementsByTagName('spot');

        for (let omni of omniNodes) {

            var idVal = this.reader.getString(omni, 'id');
            var enabledVal = this.reader.getBoolean(omni, 'enabled');

            var ambientVal = this.getRGBArray(omni.getElementsByTagName('ambient')[0]);
            var diffuseVal = this.getRGBArray(omni.getElementsByTagName('di2use')[0]);
            var specularVal = this.getRGBArray(omni.getElementsByTagName('specular')[0]);
            var locationVal = this.getCoords(omni.getElementsByTagName('location')[0])

            var omniArray = {
                id: idVal,
                enabled: enabledVal,
                ambient: ambientVal,
                diffuse: diffuseVal,
                specular: specularVal,
                location: locationVal
            }

            this.omni.push(omniArray);
        }


        for (let spot of spotNodes) {

            var idVal = this.reader.getString(omni, 'id');
            var enabledVal = this.reader.getBoolean(omni, 'enabled');

            var ambientVal = this.getRGBArray(omni.getElementsByTagName('ambient')[0]);
            var diffuseVal = this.getRGBArray(omni.getElementsByTagName('di2use')[0]);
            var specularVal = this.getRGBArray(omni.getElementsByTagName('specular')[0]);
            var locationVal = this.getCoords(omni.getElementsByTagName('location')[0]);
            var targetVal = this.getCoords(omni.getElementsByTagName('target')[0]);

            var spotArray = {
                id: idVal,
                enabled: enabledVal,
                ambient: ambientVal,
                diffuse: diffuseVal,
                specular: specularVal,
                location: locationVal,
                target: targetVal
            }

            this.spot.push(spotArray);
        }



        this.log("light Parsed");
    }

    /**
     * Parses the <TEXTURES> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block
        var textureElements = texturesNode.getElementsByTagName('texture');


        for (let textureElem of textureElements) {
            var idVal = this.reader.getString(textureElem, 'id');
            var urlVal = this.reader.getString(textureElem, 'file');

            var textureArray = {
                id: idVal,
                urL: urlVal
            }

            this.textures.push(textureArray);

        }

        console.log("Parsed textures");

        return null;
    }

    /* parses the <materials> block */
    parseMaterials(materialsNodes) {

        var materialNodes = materialsNodes.getElementsByTagName('material');

        for (let material of materialNodes) {

            var idVal = this.reader.getString(material, 'id');
            var shininessVal = this.reader.getFloat(material, 'shininess');

            var emissionVal = this.getRGBArray(material.getElementsByTagName('emission')[0]);
            var ambientVal = this.getRGBArray(material.getElementsByTagName('ambient')[0]);
            var diffuseVal = this.getRGBArray(material.getElementsByTagName('diffuse')[0]);
            var specularVal = this.getRGBArray(material.getElementsByTagName('specular')[0]);

            var materialArray = {
                id: idVal,
                shininess: shininessVal,
                emission: emissionVal,
                ambient: ambientVal,
                diffuse: diffuseVal,
                specular: specularVal
            }

            this.materials.push(materialArray);
        }

        this.log("material Parsed");
    }
    parseTransformations(transformationsNodes){

        var transformationsElements = transformationsNodes.getElementsByTagName('transformation');


        for (let transformation of transformationsElements) {
            var idVal = this.reader.getString(transformation    , 'id');


            var mat= mat4.create();
            mat4.identity(mat);


            var transf = transformation.children[0];

            var attributeArray = [];

            for (let transfAttributes of transf.attributes) {
                var attribute = {
                    name : transfAttributes.nodeName,
                    val : transfAttributes.nodeValue
                };
                attributeArray.push(attribute);
            }

            var trfTag = {
                name : transf.nodeName,
                attributes : attributeArray
            };

            var transformsRead= [];

            transformsRead.push(trfTag);

            var transforms = transformsRead.reverse();

            for(var i=0; i<transforms.length; i++){
                var trf = transforms.pop();
                if(trf.name=='translate'){
                    var x = trf.attributtes[0].angle;
                    var y = trf.attributtes[1];
                    var z = trf.attributtes[2];

                    mat4.translate(mat, mat, [x, y, z]);

                    //fazer check que a translation foi introduzida corretamente no xml

                }else if(trf.name=='rotate'){

                    var axis = trf.attributtes[0];
                    var angle = trf.attributtes[1];

                    var rotArray= [];

                    if (axis=='x'){
                        rotArray.push(1);
                        rotArray.push(0);
                        rotArray.push(0);
                    }else if (axis=='y'){
                        rotArray.push(0);
                        rotArray.push(1);
                        rotArray.push(0);
                    }else if (axis=='z'){
                        rotArray.push(0);
                        rotArray.push(0);
                        rotArray.push(1);
                    }


                    mat4.rotate(mat, mat, DEGREE_TO_RAD*angle, rotArray);

                } else if(trf.name=='scale'){
                    var x = trf.attributes[0].val;
                    var y = trf.attributes[1].val;
                    var z = trf.attributes[2].val;

                    mat4.scale(mat, mat, [x,y,z]);

                }
            }

            var object = {
                id: idVal,
                mat: mat
            };

            this.transforms.push(object);

        }
        this.log("Parsed transformations");
    }
    /* parses the <primitives> block */
    parsePrimitives(primitivesNodes) {

        var primitiveNodes = primitivesNodes.getElementsByTagName('primitive');

        for (let primitive of primitiveNodes) {

            var idVal = this.reader.getString(primitive, 'id');

            var prim = primitive.children[0];

            var attributeArray = [];

            for (let primAttributes of prim.attributes) {
                var attribute = {
                    name: primAttributes.nodeName,
                    val: primAttributes.nodeValue
                };
                attributeArray.push(attribute)
            }

            var primitiveObject = {
                id: idVal,
                name: prim.nodeName,
                attributes: attributeArray
            };

            var primitiveBuilt = {
                id : idVal,
                object : this.primitiveBuilder(primitiveObject)
            }
            this.primitives.push(primitiveBuilt);
        }

        this.log("primitives Parsed");
    }

    primitiveBuilder(object){
        var primitiveBuilt; 

        switch(object.name){
            case "cylinder":
                var base = object.attributes[0].val;
                var top =  object.attributes[1].val;
                var height =  object.attributes[2].val;
                var slices =  object.attributes[3].val;
                var stacks = object.attributes[4].val;;
                
                primitiveBuilt = new MyCylinder(this.scene, slices, stacks);

                break;
        }
     

        return primitiveBuilt;

    }

    /* parses the <component> block */
    parseComponents(componentNodes) {

        var componentNodes = componentNodes.getElementsByTagName('component');

        for (let component of componentNodes) {


            var transformationArray = [];
            var materialArray = [];
            var textureArray = [];
            var childrenArray = [];


            var idVal = this.reader.getString(component, 'id');


            var transformationNode = component.getElementsByTagName('transformation')[0];
            var materialsNode = component.getElementsByTagName('materials')[0];
            var textureNode = component.getElementsByTagName('texture')[0];
            var childrenNode = component.getElementsByTagName('children')[0];


            //Transformation
            for (let transformationChild of transformationNode.children) {
                var transformationRef = this.reader.getString(transformationChild, "id");
                var transformationObj = {
                    id: transformationRef
                };
                transformationArray.push(transformationObj);
            }

            //material
            for (let materialsChild of materialsNode.children) {
                var materialRef = this.reader.getString(materialsChild, "id");
                var materialObj = {
                    id: materialRef
                };
                materialArray.push(materialObj);
            }

            //texture
            var textureRef = this.reader.getString(textureNode, "id");
            var lengthSRef = this.reader.getString(textureNode, "length_s");
            var lengthTRef = this.reader.getString(textureNode, "length_t");
            var materialObj = {
                id: textureRef,
                length_s: lengthSRef,
                length_t: lengthTRef
            };
            textureArray.push(materialObj);


            //children
            for (let childrenChild of childrenNode.children) {
                var childrenRef = this.reader.getString(childrenChild, "id");
                var childrenType = childrenChild.nodeName;
                var childrenObj = {
                    type : childrenType,
                    ref : childrenRef
                };
                
                childrenArray.push(childrenObj);
            }


            var componentArray = {
                id : idVal,
                transformation: transformationArray,
                material: materialArray,
                texture: textureArray,
                children: childrenArray
            }
            this.components.push(componentArray);

        }

        this.log("components Parsed");
    }










    /*
     * Translate Element Coords into an usable x,y,z object
     * @param {string} element coords
     */
    getRGBArray(xmlRGB) {
        var rVal = this.reader.getFloat(xmlRGB, 'r');
        var gVal = this.reader.getFloat(xmlRGB, 'g');
        var bVal = this.reader.getFloat(xmlRGB, 'b');
        var aVal = this.reader.getFloat(xmlRGB, 'a');

        var rgb = {
            r: rVal,
            g: gVal,
            b: bVal,
            a: aVal
        };
        return rgb;
    }
    /*
     * Translate Element Coords into an usable x,y,z object
     * @param {string} element coords
     */
    getCoords(xmlCoords) {
        var x = this.reader.getFloat(xmlCoords, 'x');
        var y = this.reader.getFloat(xmlCoords, 'y');
        var z = this.reader.getFloat(xmlCoords, 'z');
        if(xmlCoords.attributes.length==4)
            var w = this.reader.getFloat(xmlCoords, 'w');

        var coords = {
            xCoord: x,
            yCoord: y,
            zCoord: z,
            wCoord: w
        };
        return coords;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        
    
        console.log("asd");
        
        this.graphLoop(this.root);
    }


    graphLoop(root){
        this.scene.pushMatrix();
        var component;
        for (var i = 0; i < this.components.length; i++) {
            if(this.components[i].id == root){
                component = this.components[i];
            }
        }

        if(component == null){
          console.error("The component " + root + " does not exist");
          return 1;
        }


        var component;
        for (var i = 0; i < this.primitives.length; i++) {
            if(this.primitives[i].id ==  component.children[0].ref){
                this.primitives[i].object.display();
            }
        }

       
        this.scene.popMatrix();

        return 0;

    }
}