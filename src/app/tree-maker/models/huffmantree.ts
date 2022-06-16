import DICTIONARY from '../constant/asciitobin';
import { Bincode } from './bincode';
import { Gain } from './gain';
import { TreeNode } from './treenode';

export class HuffmanTree {
  private heap: TreeNode[] = [];
  private size: number = 0;

  constructor(input: string) {
    let frequencyMap = this.calculateFrequency(input);

    let data: TreeNode[] = Array.from(frequencyMap.keys()).map((key) => {
      return new TreeNode(key, frequencyMap.get(key)!);
    });

    let n = data.length - 1;
    let i = 0;

    this.heap = Array.from(data);
    this.size = data.length;

    for (i = (n - 1) / 2; i >= 0; i--) {
      this.minHeapify(Math.floor(i));
    }
  }

  public buildTree() {
    while (!this.isSizeOne()) {
      let left: TreeNode = this.extractMin();

      let right: TreeNode = this.extractMin();

      let parent: TreeNode = new TreeNode(
        left.name + right.name,
        left.probability + right.probability
      );

      parent.LeftNode = left;
      parent.RightNode = right;

      this.insertMinHeap(parent);
    }

    return;
  }

  public getRoot() {
    return this.heap[0];
  }

  public minHeapify(idx: number) {
    let smallest: number = idx;
    let left: number = 2 * idx + 1;
    let right: number = 2 * idx + 2;

    if (
      left < this.size &&
      this.heap[left].probability < this.heap[smallest].probability
    ) {
      smallest = left;
    }

    if (
      right < this.size &&
      this.heap[right].probability < this.heap[smallest].probability
    ) {
      smallest = right;
    }

    if (smallest !== idx) {
      let temp: TreeNode = this.heap[idx];
      this.heap[idx] = this.heap[smallest];
      this.heap[smallest] = temp;

      this.minHeapify(smallest);
    }
  }

  public extractMin() {
    let min: TreeNode = this.heap[0];
    this.heap[0] = this.heap[this.size - 1];
    this.size--;
    this.minHeapify(0);

    return min;
  }

  public insertMinHeap(node: TreeNode) {
    this.size++;
    let idx: number = this.size - 1;

    while (
      idx &&
      this.heap[idx].probability <
        this.heap[Math.floor((idx - 1) / 2)].probability
    ) {
      this.heap[idx] = this.heap[Math.floor((idx - 1) / 2)];
      idx = Math.floor((idx - 1) / 2);
    }

    this.heap[idx] = node;

    return;
  }

  public getGain(): Gain {
    let codes = this.getLeafCodes();
    return new Gain(codes);
  }

  private getLeafCodes() {
    let codes: Map<string, Bincode> = new Map<string, Bincode>();

    this.traverse(this.heap[0], '', codes);

    return codes;
  }

  private traverse(node: TreeNode, code: string, codes: Map<string, Bincode>) {
    if (node.isLeaf) {
      codes.set(node.name, new Bincode(DICTIONARY.get(node.name)!, code));
    } else {
      if (node.LeftNode) {
        this.traverse(node.LeftNode, code + '0', codes);
      }

      if (node.RightNode) {
        this.traverse(node.RightNode, code + '1', codes);
      }
    }
  }

  private isSizeOne(): boolean {
    return this.size === 1;
  }

  private calculateFrequency(input: string) {
    let countMap = new Map<string, number>();

    for (let index = 0; index < input.length; index++) {
      let char = input[index];
      if (countMap.get(char) === undefined) {
        countMap.set(char, 1);
      } else {
        countMap.set(char, countMap.get(char)! + 1);
      }
    }

    return countMap;
  }
}
