export class TreeNode {
    public get LeftNode() { return this.leftNode; }
    public set LeftNode(value) { this.leftNode = value; }
    public get RightNode() { return this.rightNode; }
    public set RightNode(value) { this.rightNode = value; }
    public get ParentNode() { return this.parentNode; }
    public set ParentNode(value) { this.parentNode = value; }

    constructor(name: string, probability: number)
    constructor(public name: string, public probability: number, private leftNode?: TreeNode, private rightNode?: TreeNode, private parentNode?: TreeNode) {

    }
}