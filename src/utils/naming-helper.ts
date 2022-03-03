export class NamingHelper {

    public static configParamName(appName: string, paramName = 'config'): string {
        return `/${appName}/${paramName}`;
    }

    public static fromParts(parts: string[], join = '-'): string {
        return parts.filter(n => n).join(join);
    }
}