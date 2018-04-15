class LowConReply  {
    private index : number;
    private intent : string;
    private confidence : number;

    constructor (
        index : number,
        intent : string,
        confidence : number
    ){
        this.index = index;
        this.intent = intent;
        this.confidence = confidence;
    }
    public toString = () : string => {
        return `(${this.index}- I:${this.intent}, C:${this.confidence})`;
    }
    
}