from setuptools import setup


setup(name='Simpoll',
      version='0.1',
      description='A long-polling demonstration with backbone.js',
      author='Jesse Panganiban',
      author_email='me@jpanganiban.com',
      py_modules=['simpoll'],
      entry_points={
          'console_scripts': ['simpoll = simpoll:start']
        },
      install_requires=[
          'flask',
          'flask-mongoalchemy',
        ]
      )
