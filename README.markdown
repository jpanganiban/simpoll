Simpoll
=======

A simple long-polling demonstration with backbone.js and flask with gevent. 

It mainly uses gevent.event.Event.

Requirements:
* python
* virtualenv
* libevent
* mongodb

To install, download the package and run (in a virtualenv):

    python setup.py develop

This will install all the necessary packages.

After this (still under the virtualenv), type:

    simpoll

Open your favorite browser and go to

    localhost:53000
