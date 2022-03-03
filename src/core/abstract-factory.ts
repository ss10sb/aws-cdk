import {NonConstruct} from "./non-construct";
import {NameIncrementer} from "../utils/name-incrementer";

export abstract class AbstractFactory extends NonConstruct {

    nameIncrementer?: NameIncrementer;

    getIncrementedName(name: string): string {
        return this.getNameIncrementer().next(name);
    }

    private getNameIncrementer(): NameIncrementer {
        if (!this.nameIncrementer) {
            this.nameIncrementer = new NameIncrementer();
        }
        return this.nameIncrementer;
    }
}