import { TreeNode } from "./treenode";
import * as p5 from "p5";
import { Color, Vector } from "./other";

export class P5Node {
    public position: Vector;
    public leftNode: P5Node;
    public rightNode: P5Node;
    lines: { text: string, textOffset: number, vector: Vector }[];
    constructor(public node: TreeNode, public size: number, public color: Color) { }
    draw(p5: p5) {
        for (const line of this.lines) {
            p5.line(this.position.x, this.position.y, line.vector.x, line.vector.y);
            p5.fill(0);
            p5.text(line.text, (this.position.x + line.vector.x) / 2 + line.textOffset, (this.position.y + line.vector.y) / 2);
        }
        p5.fill(p5.color(this.color.r, this.color.g, this.color.b, this.color.a));
        p5.ellipse(this.position.x, this.position.y, this.size, this.size);
        p5.fill(0);
        p5.textAlign('center', 'center');
        p5.text(this.node.name, this.position.x, this.position.y);
    }
    /**
     * Changes position of its child nodes
     */
    calculatePosition(startPosition: Vector, distance: number, angle: number) {
        this.lines = [];
        this.position.x = startPosition.x;
        this.position.y = startPosition.y;

        this.leftNode?.calculatePosition(
            this.polarProjection(distance, 90 + angle),
            distance,
            angle
        );
        this.rightNode?.calculatePosition(
            this.polarProjection(distance, 90 - angle),
            distance,
            angle
        );

        if (this.leftNode) {
            this.lines.push({ text: "0", textOffset: -10, vector: { x: this.leftNode.position.x, y: this.leftNode.position.y } });
        }
        if (this.rightNode) {
            this.lines.push({ text: "1", textOffset: 10, vector: { x: this.rightNode.position.x, y: this.rightNode.position.y } });
        }
    }

    createChildren(isRecursive:boolean,depth:number):P5Node[]{
        if(this.node.LeftNode){
            this.leftNode = new P5Node(this.node.LeftNode,this.size,this.color);
        }
        if(this.node.RightNode){
            this.rightNode = new P5Node(this.node.RightNode,this.size,this.color);
        }
        const children:P5Node[] = [];
        if(isRecursive){
            children.push(...this.leftNode.createChildren(isRecursive,depth+1));
            children.push(...this.rightNode.createChildren(isRecursive,depth+1));
        }

        return children;
    }

    polarProjection(distance: number, angle: number): Vector {
        let newVector: Vector = { x: 0, y: 0 };
        newVector.x = this.position.x + distance * Math.cos(angle * (Math.PI / 180));
        newVector.y = this.position.y + distance * Math.sin(angle * (Math.PI / 180));
        return newVector;
    }
}