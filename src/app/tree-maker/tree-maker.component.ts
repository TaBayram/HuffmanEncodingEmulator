import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { HuffmanTree } from './models/huffmantree';
import { p5Node } from './models/p5node';
import { TreeNode } from './models/treenode';

@Component({
  selector: 'app-tree-maker',
  templateUrl: './tree-maker.component.html',
  styleUrls: ['./tree-maker.component.css'],
})
export class TreeMakerComponent implements OnInit {
  private canvas: p5;
  private nodes: p5Node[] = [];

  ePageType = PageType;
  pageType: PageType;
  inputForHuffman: string;
  inputForRunLength: string;

  goToRunLengthPage() {
    this.pageType = PageType.RunLength;
  }
  goToHuffmanPage() {
    this.pageType = PageType.Huffman;
  }

  constructor() {}

  ngOnInit(): void {
    this.pageType = PageType.Huffman;
  }

  generate(): void {
    // random chars
    let randomInput: string = 'AAAAAABBCCCCDEFGG';

    let huffmanTree = new HuffmanTree(randomInput);

    console.log(huffmanTree);

    console.log(huffmanTree.buildTree());
  }

  onSubmit() {
    const that = this;
    const sketch = (sketch: p5) => {
      sketch.preload = () => {
        // preload code
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

    let node1 = new TreeNode('a', 0.25);
    let node2 = new TreeNode('b', 0.25);
    node1.LeftNode = node2;
    let node3 = new TreeNode('c', 0.25);
    node1.RightNode = node3;

    let node = new p5Node(node1, 15, 0, 40, { r: 255, g: 200, b: 100, a: 255 });
    let node0 = new p5Node(node2, 0, 0, 40, { r: 255, g: 200, b: 100, a: 255 });
    node.leftNode = node0;
    let node01 = new p5Node(node3, 0, 0, 40, {
      r: 255,
      g: 200,
      b: 100,
      a: 255,
    });
    node.rightNode = node01;

    this.nodes.push(node, node0, node01);

    node.calculatePosition({ x: window.innerWidth / 2, y: 50 }, 100, 30);
  }
}

export enum PageType {
  RunLength,
  Huffman,
}
