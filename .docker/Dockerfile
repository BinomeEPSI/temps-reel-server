FROM php:7.2-apache

# see https://stackoverflow.com/a/36908278
RUN usermod -u 1000 www-data

RUN apt-get update

RUN a2enmod rewrite

RUN docker-php-ext-install sysvmsg
RUN docker-php-ext-install sysvsem
RUN docker-php-ext-install sysvshm

WORKDIR /var/www/