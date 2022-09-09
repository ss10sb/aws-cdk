export enum BrefRuntime {
    PHP82 = 'php-82',
    PHP82FPM = 'php-82-fpm',
    PHP81 = 'php-81',
    PHP81FPM = 'php-81-fpm',
    PHP80 = 'php-80',
    PHP80FPM = 'php-80-fpm',
    CONSOLE = 'console'
}

export enum LaravelHandler {
    WEB = 'public/index.php',
    QUEUE = 'worker.php',
    ARTISAN = 'artisan'
}