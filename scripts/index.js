let program = new ShapeDistanceProgram();
console.log(program);
console.log(program.shape1);
console.log(program.shape2);
/**points in UI are 3 by default. so update points array
which ensures min(1) and max(10) points aren't exceded
**/
for(let x = 0; x < 3; x++){
	program.shape1.addPoint();
	program.shape2.addPoint();
}

let set_attribute = function(input, attributes) {
	Object.keys(attributes).forEach(function(attribute) {
		input.setAttribute(attribute, attributes[attribute]);
	});
	return input;
};

let new_point = function(event) {
	let list;
	let nodes;
	let programShape;

    //make sure we're adding point to a particular shape and not the two shapes at once
	if(event.target.parentElement.parentElement.id == "shape_1") {
    	list = document.querySelector(".shape_1");
		nodes = document.querySelectorAll(".shape_1 .point");
		programShape = program.shape1;
    } else {
    	list = document.querySelector(".shape_2");
		nodes = document.querySelectorAll(".shape_2 .point");
		programShape = program.shape2;
	}

    //if we've reached maximum number of points, exit. Else, add point.
	if(programShape.pointCount == 10)
		return;

    const point_number = nodes.length;

    const div = document.createElement("div");
    div.setAttribute("class", "point");
    const paragraph = document.createElement("p");
    paragraph.textContent = `Point ${point_number + 1}`;
    div.append(paragraph);

    let option1 = {
    	"type": "text",
    	"name": "x",
    	"class": "card"
    };
    const option2 = {
    	"type": "button",
    	"name": "btn_del_point",
    	"value": "Remove",
    	"class": "remove card"
    };

    let input1 = document.createElement("input");
    const set_input1_attributes = set_attribute(input1, option1);
    div.append(set_input1_attributes);
    let input2 = document.createElement("input");
    option1.name = 'y';
    const set_input2_attributes = set_attribute(input2, option1);
    div.append(set_input2_attributes);
    let input3 = document.createElement("input");
    const set_input3_attributes = set_attribute(input3, option2);
    remove_listener(input3);
    div.append(set_input3_attributes);

	list.insertBefore(div, list.lastElementChild);
    //increase count of points for a shape
	programShape.addPoint();
};

let delete_point = function(event) {
	let point = event.target.parentNode;
	let point_parent = point.parentNode;
	let programShape;

    let remaining_nodes;
    if(point_parent.id == "shape_1") {
        programShape = program.shape1;
        //if we've reached minimum number of points, exit. Else, remove point.
        if(programShape.pointCount == 1)
            return;
        point_parent.removeChild(point);
        remaining_nodes = document.querySelectorAll(".shape_1 .point");
    } else {
        programShape = program.shape2;

        if(programShape.pointCount == 1)
            return;
        point_parent.removeChild(point);
        remaining_nodes = document.querySelectorAll(".shape_2 .point");
    }

	//re-number point numbers
	for(let i = 0; i < remaining_nodes.length; i++) {
	    let node = remaining_nodes[i].firstElementChild;
	 	node.textContent = `Point ${i + 1}`;
	}
    //reduce count of points for a shape
	programShape.removePoint();
};

let filter_input = function(input) {
	//filter out non-numbers, floats and negative numbers
	//only positive numbers are allowed
	let parse_number = /^(\d+)$/;
	let result = parse_number.test(input);
	return result;
};

let set_shape_points = function(shape){
	let program_shape = shape == "shape_1" ? program.shape1 : program.shape2;

	let d_shape = document.getElementById(shape);
	let point_list = d_shape.querySelectorAll(".point");
	for(let point = 0; point < point_list.length; point++){
		let d_point = point_list[point];
		let value_list= d_point.querySelectorAll("[type=text]");
		let xValue = value_list[0].value;
		let yValue = value_list[1].value;
		program_shape.editPointX(point,parseInt(xValue,10));
		program_shape.editPointY(point,parseInt(yValue,10));
	}
};

let clear_canvas = function(){
	let canvas = document.getElementById("drawing_canvas");
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, maxXValues, maxYValues);
};

let draw_shape = function(shape){
	let canvas = document.getElementById("drawing_canvas");
	let ctx = canvas.getContext('2d');
	ctx.fillStyle = 'red';
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 1;
	ctx.beginPath();

	ctx.moveTo(shape.getPointX(0),shape.getPointY(0)); //moves somewhere without creating a line

	for(let index = 1; index < shape.pointCount; index++){
		ctx.lineTo(shape.getPointX(index),shape.getPointY(index));
	}
	ctx.closePath();
	ctx.stroke();
};

let draw_line =function(line) {
    let canvas = document.getElementById("drawing_canvas");
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(line.point1.x, line.point1.y);
    ctx.lineTo(line.point2.x, line.point2.y);
    ctx.closePath();
    ctx.stroke();
};

let display_distance_between_shapes = function(distance) {
    let text = `The distance between is: ${distance}`;
    let message_div = document.querySelector(".display_other_messages");
    let paragraph = document.createElement("p");
    paragraph.textContent = text;
    message_div.appendChild(paragraph);
};

let display_closet_points_of_shapes = function(point1, point2) {
    let text1 = `Closest point of shape 1: (${point1.x}, ${point1.y})`;
    let text2 = `Closest point of shape 2: (${point2.x}, ${point2.y})`;
    let message_div = document.querySelector(".display_other_messages");
    let paragraph1 = document.createElement("p");
    let paragraph2 = document.createElement("p");
    paragraph1.textContent = text1;
    paragraph2.textContent = text2;
    message_div.appendChild(paragraph1);
    message_div.appendChild(paragraph2);
};

let display_error_message = function(error_obj, shape) {
    let text1 = `${error_obj.errorType}`;
    let text2 = `Shape with error: ${shape}`;
    let text3 = error_obj.message;
    let message_div = document.querySelector(".display_other_messages");
    let paragraph1 = document.createElement("p");
    let paragraph2 = document.createElement("p");
    let paragraph3 = document.createElement("p");
    paragraph1.textContent = text1;
    paragraph2.textContent = text2;
    paragraph3.textContent = text3;
    message_div.appendChild(paragraph1);
    message_div.appendChild(paragraph2);
    message_div.appendChild(paragraph3);
};

let calculate_distance = function(event) {
	let input_list = document.querySelectorAll("[type=text]");
	for(let i = 0; i < input_list.length; i++){
		let result = filter_input(input_list[i].value);
		if (!result) {
			let error = document.querySelector(".error_message");
			error.style.display = 'flex';
			input_list[i].style.border = '1px solid red';
			return;
		}
	}

	//set each point's x and y value for each shape
	set_shape_points("shape_1");
	set_shape_points("shape_2");

    //validate that all x and y values in a point are within range, that points are unique and don't intersect each other
	let shape1 = program.shape1;
	let shape2 = program.shape2;

    let validity1 = shape1.isValid();
    if(validity1.status == "error") {
        display_error_message(validity1, "shape 1");
        return;
    }

    let validity2 = shape2.isValid();
    if(validity2.status == "error") {
        display_error_message(validity2, "shape 2");
        return;
    }

    //if all passes above, clear canvas, draw shape then
	clear_canvas();
	draw_shape(shape1);
	draw_shape(shape2);

    //then calculate the shortest distance between the two shapes and draw a line between the closet vertices
    let result = Shape.calculateDistance(shape1, shape2);
    console.log(result);
    draw_line(result);

    display_distance_between_shapes(result.distance);
    display_closet_points_of_shapes(result.point1, result.point2);
};

let point_listener = function(element) {
	element.addEventListener("click", new_point);
};

let remove_listener = function(element) {
	element.addEventListener("click", delete_point);
};

const point_list = document.querySelectorAll(".new_point");
for (let point of point_list) {
	point_listener(point);
}

const remove_point_list = document.querySelectorAll(".remove");
for (let remove_point of remove_point_list) {
	remove_listener(remove_point);
}

//calculate distance
document.querySelector(".calculate").addEventListener("click", calculate_distance);
