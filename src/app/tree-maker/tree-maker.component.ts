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
          sketch.createCanvas(window.innerWidth, 1600);
        };
        sketch.draw = () => {
          sketch.background(100);
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
    averageGain.codes.forEach((code,key) =>{
      this.rows.push({name:key,code:code});
    })
    this.rows.sort((code1,code2 )=> code1.code.coded.length - code2.code.coded.length);
    const root = huffmanTree.getRoot();
    this.createTree(root);

  }

  public createTree(root: TreeNode) {
    this.nodes = [];
    const size = 40;
    const color: Color = { r: 200, g: 0, b: 200, a: 255 };
    const pNodes: P5Node[] = [];
    const topNode = new P5Node(root, size, color);
    pNodes.push(topNode);
    const childNodes = topNode.createChildren(true, 0);
    pNodes.push(...childNodes.nodes);

    const anglePerDepth = -20;
    const distancePerDepth = -childNodes.depth*10;
    const distance = 60 + childNodes.depth *30;
    const angle = 30 + childNodes.depth * 10;
    

    topNode.calculatePosition({ x: this.canvas.width / 2, y: 50 }, distance, angle, anglePerDepth, distancePerDepth);
    this.nodes.push(...pNodes);
  }
}

export enum PageType {
  RunLength,
  Huffman,
}
