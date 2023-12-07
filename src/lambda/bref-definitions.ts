// @ts-nocheck
export enum BrefRuntimeAccount {
    CORE = '534081306603',
    EXTRA = '403367587399'
}

export enum BrefRuntime {
    PHP83 = 'php-83',
    PHP83FPM = 'php-83-fpm',

    PHP82 = 'php-82',
    PHP82FPM = 'php-82-fpm',

    PHP81 = 'php-81',
    PHP81FPM = 'php-81-fpm',

    PHP80 = 'php-80',
    PHP80FPM = 'php-80-fpm',

    CONSOLE = 'console',

    GD83 = 'gd-php-83',
    GD82 = 'gd-php-82',
    GD81 = 'gd-php-81',
    GD80 = 'gd-php-80',

    LDAP83 = 'ldap-php-83',
    LDAP82 = 'ldap-php-82',
    LDAP81 = 'ldap-php-81',
    LDAP80 = 'ldap-php-80',

    MONGODB83 = 'mongodb-php-83',
    MONGODB82 = 'mongodb-php-82',
    MONGODB81 = 'mongodb-php-81',
    MONGODB80 = 'mongodb-php-80',

    ORACLE83 = 'oci8-php-83',
    ORACLE82 = 'oci8-php-82',
    ORACLE81 = 'oci8-php-81',
    ORACLE80 = 'oci8-php-80',

    PGSQL83 = 'pgsql-php-83',
    PGSQL82 = 'pgsql-php-82',
    PGSQL81 = 'pgsql-php-81',
    PGSQL80 = 'pgsql-php-80',

    REDIS83 = 'redis-php-83',
    REDIS82 = 'redis-php-82',
    REDIS81 = 'redis-php-81',
    REDIS80 = 'redis-php-80',

    SNOWFLAKE83 = 'odbc-snowflake-php-83',
    SNOWFLAKE82 = 'odbc-snowflake-php-82',
    SNOWFLAKE81 = 'odbc-snowflake-php-81',
    SNOWFLAKE80 = 'odbc-snowflake-php-80',

    SQLSRV83 = 'sqlsrv-php-83',
    SQLSRV82 = 'sqlsrv-php-82',
    SQLSRV81 = 'sqlsrv-php-81',
    SQLSRV80 = 'sqlsrv-php-80',

    UUID83 = 'uuid-php-83',
    UUID82 = 'uuid-php-82',
    UUID81 = 'uuid-php-81',
    UUID80 = 'uuid-php-80',

    XDEBUG83 = 'xdebug-php-83',
    XDEBUG82 = 'xdebug-php-82',
    XDEBUG81 = 'xdebug-php-81',
    XDEBUG80 = 'xdebug-php-80',
}

interface ReadonlyMap<TKey, TValue> {
    get(key: TKey): TValue;
}

export const BrefRuntimes: ReadonlyMap<BrefRuntime, BrefRuntimeAccount> = new Map([
    [BrefRuntime.PHP83, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP83FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.PHP82, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP82FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.PHP81, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP81FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.PHP80, BrefRuntimeAccount.CORE],
    [BrefRuntime.PHP80FPM, BrefRuntimeAccount.CORE],

    [BrefRuntime.CONSOLE, BrefRuntimeAccount.CORE],

    [BrefRuntime.GD83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.GD82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.GD81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.GD80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.LDAP83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.LDAP82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.LDAP81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.LDAP80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.MONGODB83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.MONGODB82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.MONGODB81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.MONGODB80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.ORACLE83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.ORACLE82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.ORACLE81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.ORACLE80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.PGSQL83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.PGSQL82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.PGSQL81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.PGSQL80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.REDIS83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.REDIS82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.REDIS81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.REDIS80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.SNOWFLAKE83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SNOWFLAKE82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SNOWFLAKE81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SNOWFLAKE80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.SQLSRV83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SQLSRV82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SQLSRV81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.SQLSRV80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.UUID83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.UUID82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.UUID81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.UUID80, BrefRuntimeAccount.EXTRA],

    [BrefRuntime.XDEBUG83, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.XDEBUG82, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.XDEBUG81, BrefRuntimeAccount.EXTRA],
    [BrefRuntime.XDEBUG80, BrefRuntimeAccount.EXTRA],
]);

export enum LaravelHandler {
    WEB = 'public/index.php',
    QUEUE = 'Bref\\LaravelBridge\\Queue\\QueueHandler',
    ARTISAN = 'artisan'
}