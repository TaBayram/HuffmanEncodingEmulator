import { TreeNode } from './treenode';
import * as p5 from 'p5';

type Vector = { x: number; y: number };
type Color = { r: number; g: number; b: number; a: number };

export class p5Node {
  public leftNode: p5Node;
  public rightNode: p5Node;
  lines: { text: string; textOffset: number; vector: Vector }[];
  constructor(
    public node: TreeNode,
    public x: number,
    public y: number,
    public size: number,
    public color: Color
  ) {}
  draw(p5: p5) {
    for (const line of this.lines) {
      p5.line(this.x, this.y, line.vector.x, line.vector.y);
      p5.fill(0);
      p5.text(
        line.text,
        (this.x + line.vector.x) / 2 + line.textOffset,
        (this.y + line.vector.y) / 2
      );
    }
    p5.fill(p5.color(this.color.r, this.color.g, this.color.b, this.color.a));
    p5.ellipse(this.x, this.y, this.size, this.size);
    p5.fill(0);
    p5.textAlign('center', 'center');
    p5.text(this.node.name, this.x, this.y);
  }

  /**
   * Changes position of its child nodes
   */
  calculatePosition(startPosition: Vector, distance: number, angle: number) {
    this.lines = [];
    this.x = startPosition.x;
    this.y = startPosition.y;

    this.leftNode?.calculatePosition(
      this.PolarProjection(distance, 90 + angle),
      distance,
      angle
    );
    this.rightNode?.calculatePosition(
      this.PolarProjection(distance, 90 - angle),
      distance,
      angle
    );

    if (this.leftNode) {
      this.lines.push({
        text: '0',
        textOffset: -10,
        vector: { x: this.leftNode.x, y: this.leftNode.y },
      });
    }
    if (this.rightNode) {
      this.lines.push({
        text: '1',
        textOffset: 10,
        vector: { x: this.rightNode.x, y: this.rightNode.y },
      });
    }
  }

  PolarProjection(distance: number, angle: number): Vector {
    let newVector: Vector = { x: 0, y: 0 };
    newVector.x = this.x + distance * Math.cos(angle * (Math.PI / 180));
    newVector.y = this.y + distance * Math.sin(angle * (Math.PI / 180));
    return newVector;
  }
}
