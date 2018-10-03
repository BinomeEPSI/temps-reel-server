FROM php:7.2-apache

RUN apt-get update

RUN a2enmod rewrite

RUN docker-php-ext-install sysvmsg sysvsem sysvshm

WORKDIR /var/www/