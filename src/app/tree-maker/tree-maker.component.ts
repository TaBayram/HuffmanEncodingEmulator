import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { HuffmanTree } from './models/huffmantree';
import { P5Node } from './models/p5node';
import { TreeNode } from './models/treenode';
import { Color, Vector } from "./models/other";

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

  rows:{name:string,probability:string}[] =[{name:"tay",probability:"0.2"},{name:"tay2",probability:"0.2"}];

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

    console.log(averageGain);
  }

  onSubmit() {
    const sketch = (sketch: p5) => {
      sketch.preload = () => {
      };
      sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, 400);
      };
      sketch.draw = () => {
        for (const node of this.nodes) {
          node.draw(sketch);
        }
      };
    };
    this.canvas = new p5(sketch);

  }

  public createTree(nodes: TreeNode[]) {
    this.nodes = [];
    const size = 40;
    const color: Color = { r: 200, g: 0, b: 200, a: 255 };
    const pNodes: P5Node[] = [];
    const topNode = new P5Node(nodes[0], size, color);
    pNodes.push(topNode);
    pNodes.push(...topNode.createChildren(true,0));

    this.nodes.push(...pNodes);
  }
}

export enum PageType {
  RunLength,
  Huffman,
}
