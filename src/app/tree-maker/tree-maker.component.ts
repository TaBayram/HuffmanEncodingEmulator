import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { HuffmanTree } from './models/huffmantree';
import { P5Node } from './models/p5node';
import { TreeNode } from './models/treenode';
import { Color, Vector } from "./models/other";
import { Bincode } from './models/bincode';

@Component({
  selector: 'app-tree-maker',
  templateUrl: './tree-maker.component.html',
  styleUrls: ['./tree-maker.component.css'],
})
export class TreeMakerComponent implements OnInit {
  private canvas: p5;
  private nodes: P5Node[] = [];

  ePageType = PageType;
  pageType: PageType;
  inputForHuffman: string;
  inputForRunLength: string;

  rows: { name: string, code: Bincode }[] = [];

  goToRunLengthPage() {
    this.pageType = PageType.RunLength;
  }
  goToHuffmanPage() {
    this.pageType = PageType.Huffman;
  }

  constructor() { }

  ngOnInit(): void {
    this.pageType = PageType.Huffman;
  }

  generate(): void {
    // random chars
    let randomInput: string = 'AAAAAABBCCCCDEFGG';

    let huffmanTree = new HuffmanTree(randomInput);

    let tree = huffmanTree.buildTree();

    let averageGain = huffmanTree.getGain();
    huffmanTree.getRoot();

    console.log(averageGain);
  }

  onSubmit() {
    if (!this.canvas) {
      const sketch = (sketch: p5) => {
        sketch.preload = () => {
        };
        sketch.setup = () => {
          sketch.createCanvas(window.innerWidth, 400);
        };
        sketch.draw = () => {
          sketch.background(250);
          for (const node of this.nodes) {
            node.draw(sketch);
          }
        };
      };
      this.canvas = new p5(sketch);
    }


    const huffmanTree = new HuffmanTree(this.inputForHuffman.trim());
    huffmanTree.buildTree();
    const averageGain = huffmanTree.getGain();
    this.rows = [];
    averageGain.codes.forEach((code, key) => {
      this.rows.push({ name: key, code: code });
    })
    this.rows.sort((code1, code2) => code1.code.coded.length - code2.code.coded.length);
    const root = huffmanTree.getRoot();
    this.createTree(root);

  }

  public createTree(root: TreeNode) {
    this.nodes = [];
    const size = 40;
    const color: Color = { r: 240, g: 240, b: 240, a: 255 };
    const pNodes: P5Node[] = [];
    const topNode = new P5Node(root, size, color);
    pNodes.push(topNode);
    const childNodes = topNode.createChildren(true, 0);
    pNodes.push(...childNodes.nodes);

    const powDepth = Math.pow(2, childNodes.depth);
    const anglePerDepth = -10;
    const distancePerDepth = -childNodes.depth * 2.5;
    const distance = 90 + powDepth * 10;
    const angle = 40 + powDepth * 1;


    topNode.calculatePosition({ x: this.canvas.width / 2, y: 50 }, distance, angle, distancePerDepth, anglePerDepth);
    this.nodes.push(...pNodes);

    this.canvas.resizeCanvas(window.innerWidth, (distance + powDepth*10)*2.25, true);
  }
}

export enum PageType {
  RunLength,
  Huffman,
}
