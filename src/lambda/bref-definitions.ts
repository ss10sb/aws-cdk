// @ts-nocheck
export enum BrefRuntimeAccount {
    CORE = '873528684822', // Bref 3: 873528684822
    EXTRA = '403367587399'
}

export enum BrefRuntime {
    PHP85 = 'php-85',
    PHP85FPM = 'php-85-fpm',

    PHP84 = 'php-84',
    PHP84FPM = 'php-84-fpm',

    PHP83 = 'php-83',
    PHP83FPM = 'php-83-fpm',

    PHP82 = 'php-82',
    PHP82FPM = 'php-82-fpm',

    GD85 = 'gd-php-85',
    GD84 = 'gd-php-84',
    GD83 = 'gd-php-83',
    GD82 = 'gd-php-82',

    LDAP85 = 'ldap-php-85',
    LDAP84 = 'ldap-php-84',
    LDAP83 = 'ldap-php-83',
    LDAP82 = 'ldap-php-82',

    MONGODB85 = 'mongodb-php-85',
    MONGODB84 = 'mongodb-php-84',
    MONGODB83 = 'mongodb-php-83',
    MONGODB82 = 'mongodb-php-82',

    ORACLE85 = 'oci8-php-85',
    ORACLE84 = 'oci8-php-84',
    ORACLE83 = 'oci8-php-83',

    SNOWFLAKE85 = 'odbc-snowflake-php-85',
    SNOWFLAKE84 = 'odbc-snowflake-php-84',
    SNOWFLAKE83 = 'odbc-snowflake-php-83',
    SNOWFLAKE82 = 'odbc-snowflake-php-82',

    SQLSRV85 = 'sqlsrv-php-85',
    SQLSRV84 = 'sqlsrv-php-84',
    SQLSRV83 = 'sqlsrv-php-83',
    SQLSRV82 = 'sqlsrv-php-82',

    UUID85 = 'uuid-php-85',
    UUID84 = 'uuid-php-84',
    UUID83 = 'uuid-php-83',
    UUID82 = 'uuid-php-82',

    XDEBUG85 = 'xdebug-php-85',
    XDEBUG84 = 'xdebug-php-84',
    XDEBUG83 = 'xdebug-php-83',
    XDEBUG82 = 'xdebug-php-82',
}

interface ReadonlyMap<TKey, TValue> {
    get(key: TKey): TValue;
}

export const BrefRuntimes: ReadonlyMap<BrefRuntime, BrefRuntimeAccount> = new Map([
    [BrefRuntime.PHP85, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP85FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.PHP84, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP84FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.PHP83, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP83FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.PHP82, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP82FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.GD85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.GD84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.GD83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.GD82, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.LDAP85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.LDAP84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.LDAP83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.LDAP82, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.MONGODB85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.MONGODB84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.MONGODB83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.MONGODB82, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.ORACLE85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.ORACLE84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.ORACLE83, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.SNOWFLAKE85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SNOWFLAKE84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SNOWFLAKE83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SNOWFLAKE82, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.SQLSRV85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SQLSRV84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SQLSRV83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SQLSRV82, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.UUID85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.UUID84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.UUID83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.UUID82, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.XDEBUG85, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.XDEBUG84, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.XDEBUG83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.XDEBUG82, BrefRuntimeAccount.EXTRA],
]);

export enum LaravelHandler {
    WEB = 'public/index.php',
    QUEUE = 'Bref\\LaravelBridge\\Queue\\QueueHandler',
    ARTISAN = 'artisan'
}