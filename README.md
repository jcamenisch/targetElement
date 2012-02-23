.targetElement()
================

(Apologies, this readme is a stub)

Purpose
-------

Based on a link or other 'pointer' DOM element, quickly get the DOM element to which it refers.

In some cases,

    $('a.my-link').targetElement();

will be the same as getting

    $($('a.my-link').attr('href')); // Get the element whose id matches the link's href

or

    $('#'+$('a.my-link').attr('rel')); // Get the element whose id matches the link's rel

However, it allows you to transparently handle some more complicated scenarios as well.

Usage
-----

### Href to internal anchor

### The rel attribute

### The for attribute

### Href to external url

### Advanced options