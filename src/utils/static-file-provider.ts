import * as path from 'path';
import * as fs from 'fs';

export class StaticFileProvider {

    readonly baseDirectory: string;
    readonly defaultDirectory = 'cdk.out/providers';

    constructor(baseDirectory?: string) {
        this.baseDirectory = baseDirectory ?? this.getDefaultDirectory();
    }

    public static convertStringToJson(value: string): Record<string, any> {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.log("Error parsing JSON", value);
        }
        return {};
    }

    fetch<T = Record<string, any>>(name: string): T | undefined {
        const fileName = this.getFileName(name);
        if (this.exists(name)) {
            return <T>StaticFileProvider.convertStringToJson(fs.readFileSync(fileName, 'utf-8'));
        }
    }

    put(name: string, data: object): void {
        this.putString(name, JSON.stringify(data));
    }

    putString(name: string, data: string): void {
        this.ensureDirectory(this.baseDirectory);
        const fileName = this.getFileName(name);
        fs.writeFileSync(fileName, data);
    }

    cleanup(): void {
        if (fs.existsSync(this.baseDirectory)) {
            for (const fileName of fs.readdirSync(this.baseDirectory)) {
                const fullPath = path.resolve(this.baseDirectory, fileName);
                fs.rmSync(fullPath);
            }
            fs.rmdirSync(this.baseDirectory);
        }
    }

    remove(name: string): void {
        const fileName = this.getFileName(name);
        if (this.exists(name)) {
            fs.rmSync(fileName);
        }
    }

    exists(name: string): boolean {
        const fileName = this.getFileName(name);
        return fs.existsSync(fileName);
    }

    getFileName(name: string): string {
        this.sanitize(name);
        const fileName = path.resolve(this.baseDirectory, `${name}.json`);
        if (fileName.indexOf(this.baseDirectory) !== 0) {
            throw new Error('Path traversal.');
        }
        return fileName;
    }

    private getDefaultDirectory(): string {
        return path.resolve(process.cwd(), this.defaultDirectory);
    }

    private ensureDirectory(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, {recursive: true});
        }
    }

    private sanitize(name: string): void {
        if (name.indexOf('\0') !== -1) {
            throw new Error('Null bytes.');
        }
        if (!/^[A-z0-9_-]+$/.test(name)) {
            throw new Error('Invalid character. Allows "A-z 0-9 _ -".');
        }
    }
}