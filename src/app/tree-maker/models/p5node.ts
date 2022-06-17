import { TreeNode } from "./treenode";
import * as p5 from "p5";
import { Color, Vector } from "./other";

export class P5Node {
    public position: Vector = { x: 0, y: 0 };
    public leftNode: P5Node;
    public rightNode: P5Node;
    public parentNode: P5Node;

    public side: 'left' | 'right' | 'mid' = 'mid';
    public maxDepth: number;

    private lines: { text: string, textOffset: number, vector: Vector }[] = [];

    constructor(public node: TreeNode, public size: number, public color: Color) { }

    draw(p5: p5) {
        const nameLength = this.node.name.length;
        const widthBonus = (nameLength != 1) ? nameLength * 5 : 0;

        for (const line of this.lines) {
            p5.line(this.position.x, this.position.y, line.vector.x, line.vector.y);
            p5.fill(0);
            p5.text(line.text, (this.position.x + line.vector.x) / 2 + line.textOffset, (this.position.y + line.vector.y) / 2);
        }
        p5.strokeWeight(2);
        p5.fill(p5.color(this.color.r, this.color.g, this.color.b, this.color.a));
        p5.rectMode("center")
        p5.rect(this.position.x, this.position.y, this.size + widthBonus, this.size, 10);
        p5.fill(0);
        p5.textAlign('center', 'center');
        p5.textWrap(p5.CHAR)
        p5.textSize(Math.max(20 - nameLength*.5, 8));
        p5.text(this.node.name, this.position.x, this.position.y, this.size + widthBonus, this.size);
    }
    /**
     * Changes position of its child nodes
     */
    calculatePosition(startPosition: Vector, distance: number, angle: number, distancePerDepth: number, anglePerDepth: number, depth: number = 0) {
        this.position.x = startPosition.x;
        this.position.y = startPosition.y;
        const weirdAdjuster = 50;

        const powDepth = Math.pow(2, depth);

        if (this.leftNode) {
            const nDistance = Math.max(distance + distancePerDepth * powDepth, this.size + 30);
            const nAngle = Math.min(Math.max(90 + angle + anglePerDepth * powDepth - ((this.side == "right") ? weirdAdjuster * depth : 0), 100), 170);
            const polar = this.polarProjection(nDistance, nAngle);
            this.leftNode?.calculatePosition(polar, distance, angle, distancePerDepth, anglePerDepth, depth + 1);
            this.lines.push({ text: "0", textOffset: -10, vector: { x: this.leftNode.position.x, y: this.leftNode.position.y } });
        }
        if (this.rightNode) {
            const nDistance = Math.max(distance + distancePerDepth * powDepth, this.size + 30);
            const nAngle = Math.max(Math.min(90 - angle - anglePerDepth * powDepth + ((this.side == "left") ? weirdAdjuster * depth : 0), 80), 10);
            const polar = this.polarProjection(nDistance, nAngle);
            this.rightNode?.calculatePosition(polar, distance, angle, distancePerDepth, anglePerDepth, depth + 1);
            this.lines.push({ text: "1", textOffset: 10, vector: { x: this.rightNode.position.x, y: this.rightNode.position.y } });
        }
    }

    createChildren(isRecursive: boolean, depth: number): { nodes: P5Node[], depth: number } {
        if (this.node.LeftNode) {
            this.leftNode = new P5Node(this.node.LeftNode, this.size, this.color);
            this.leftNode.parentNode = this;
            this.leftNode.side = 'left';
        }
        if (this.node.RightNode) {
            this.rightNode = new P5Node(this.node.RightNode, this.size, this.color);
            this.rightNode.parentNode = this;
            this.rightNode.side = 'right';
        }
        const children: P5Node[] = [];
        this.maxDepth = depth;
        if (isRecursive) {
            if (this.leftNode) {
                children.push(this.leftNode);
                const data = this.leftNode.createChildren(isRecursive, depth + 1);
                children.push(...data.nodes);
                if (this.maxDepth < data.depth) {
                    this.maxDepth = data.depth;
                }
            }
            if (this.rightNode) {
                children.push(this.rightNode);
                const data = this.rightNode.createChildren(isRecursive, depth + 1)
                children.push(...data.nodes);
                if (this.maxDepth < data.depth) {
                    this.maxDepth = data.depth;
                }
            }
        }


        return { nodes: children, depth: this.maxDepth };
    }

    polarProjection(distance: number, angle: number): Vector {
        let newVector: Vector = { x: 0, y: 0 };
        newVector.x = this.position.x + distance * Math.cos(angle * (Math.PI / 180));
        newVector.y = this.position.y + distance * Math.sin(angle * (Math.PI / 180));
        return newVector;
    }
}