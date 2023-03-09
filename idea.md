User writes a schema that a template uses, the schema has description of what each field or an object is and a template that works with the schema
user can select a schema in webview in order to use it
user gets the schema from the server for a given template, it renders it as a form.
As the user writes the schema, they can preview the template

Server
Filesystem
    /templates
        /podział_majątku_wspólnego
            /tmeplate
                # Jumja template
            /schema
                # It's a Json schema for the data used as anruments in the tempplate
        ...


Co muszę zrobić?

Server api python
    Routes
        - User wysyła template, jest ona validowana, odstaje spowrotem json schema, jak nie to error wysyła Putem, to samo co edit
        - user dodaje template do katalogu,template jest validowany jeżeli jest ok to jest zapisane 
        - User edytuje template, jest to strona taka sama jak create, wysyła Putem to samo co create
        - user usuwa zapisane template
        - user resetuje stan katalogu do defaultowego
        - User renderuje template, wystła formularzem dane, jak jest błąd to error, jak jest ok to dostaje text