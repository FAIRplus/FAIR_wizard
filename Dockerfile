## ------------ first stage: --------------
## 

# Use a small linux with Python
FROM python:3.7.8-slim-buster AS jupyterbookbuilder-base-image

RUN pip install                                          \
            alabaster==0.7.12                               \
            anyio==2.2.0                                \
            argon2-cffi==20.1.0                             \
            async-generator==1.10                               \
            attrs==20.3.0                               \
            Babel==2.9.0                                \
            backcall==0.2.0                             \
            beautifulsoup4==4.9.3                               \
            bleach==3.3.0                               \
            certifi==2020.12.5                              \
            cffi==1.14.5                                \
            chardet==4.0.0                              \
            click==7.1.2                                \
            colorama==0.4.4                             \
            decorator==5.0.7                                \
            defusedxml==0.7.1                               \
            deprecation==2.1.0                              \
            docutils==0.16                              \
            entrypoints==0.3                                \
            gitdb==4.0.7                                \
            GitPython==3.1.14                               \
            idna==2.10                              \
            imagesize==1.2.0                                \
            importlib-metadata==4.0.1                               \
            ipykernel==5.5.3                                \
            ipython==7.22.0                             \
            ipython-genutils==0.2.0                             \
            ipywidgets==7.6.3                               \
            jedi==0.18.0                                \
            Jinja2==2.11.3                              \
            jsonschema==3.2.0                               \
            jupyter-book==0.10.2                                \
            jupyter-cache==0.4.2                                \
            jupyter-client==6.1.12                              \
            jupyter-core==4.7.1                             \
            jupyter-packaging==0.9.2                                \
            jupyter-server==1.6.4                               \
            jupyter-server-mathjax==0.2.2                               \
            jupyter-sphinx==0.3.1                               \
            jupyterbook-latex==0.2.0                                \
            jupyterlab-widgets==1.0.0                               \
            jupytext==1.10.3                                \
            latexcodec==2.0.1                               \
            linkify-it-py==1.0.1                                \
            markdown-it-py==0.6.2                               \
            MarkupSafe==1.1.1                               \
            mdit-py-plugins==0.2.6                              \
            mistune==0.8.4                              \
            myst-nb==0.12.0                             \
            myst-parser==0.13.6                             \
            nbclient==0.5.3                             \
            nbconvert==5.6.1                                \
            nbdime==3.0.0                               \
            nbformat==5.1.3                             \
            nest-asyncio==1.5.1                             \
            nested-lookup==0.2.22                               \
            notebook==6.3.0                             \
            packaging==20.9                             \
            pandocfilters==1.4.3                                \
            parso==0.8.2                                \
            pexpect==4.8.0                              \
            pickleshare==0.7.5                              \
            prometheus-client==0.10.1                               \
            prompt-toolkit==3.0.18                              \
            ptyprocess==0.7.0                               \
            pybtex==0.24.0                              \
            pybtex-docutils==1.0.0                              \
            pycparser==2.20                             \
            pydata-sphinx-theme==0.4.3                              \
            Pygments==2.8.1                             \
            pyparsing==2.4.7                                \
            pyrsistent==0.17.3                              \
            python-dateutil==2.8.1                              \
            pytz==2021.1                                \
            PyYAML==5.4.1                               \
            pyzmq==22.0.3                               \
            requests==2.25.1                                \
            Send2Trash==1.5.0                               \
            six==1.15.0                             \
            smmap==4.0.0                                \
            sniffio==1.2.0                              \
            snowballstemmer==2.1.0                              \
            soupsieve==2.2.1                                \
            Sphinx==3.5.4                               \
            sphinx-book-theme==0.0.42                               \
            sphinx-comments==0.0.3                              \
            sphinx-copybutton==0.3.1                                \
            sphinx-panels==0.5.2                                \
            sphinx-thebe==0.0.8                             \
            sphinx-togglebutton==0.2.3                              \
            sphinxcontrib-applehelp==1.0.2                              \
            sphinxcontrib-bibtex==2.1.4                             \
            sphinxcontrib-devhelp==1.0.2                                \
            sphinxcontrib-htmlhelp==1.0.3                               \
            sphinxcontrib-jsmath==1.0.1                             \
            sphinxcontrib-qthelp==1.0.3                             \
            sphinxcontrib-serializinghtml==1.1.4                                \
            sphinx-sitemap>=2.2.0                              \
            SQLAlchemy==1.3.24                              \
            terminado==0.9.4                                \
            testpath==0.4.4                             \
            toml==0.10.2                                \
            tomlkit==0.7.0                              \
            tornado==6.1                                \
            traitlets==5.0.5                                \
            uc-micro-py==1.0.1                              \
            urllib3==1.26.4                             \
            wcwidth==0.2.5                              \
            webencodings==0.5.1                             \
            widgetsnbextension==3.5.1                               \
            zipp==3.4.1                             \
            pygments-csv-lexer==0.1.3

# Document
RUN pip freeze > /pip_freeze_actual.txt

# Print
RUN cat /pip_freeze_actual.txt

## ------------ next stage: --------------
## load the content

FROM jupyterbookbuilder-base-image AS jupyterbookbuilder

RUN mkdir -p /app/_build/html

# Set the working directory.
WORKDIR /app

# Copy strictly necessary files 
COPY ./   ./

# Start the actual build
RUN jupyter-book build /app
#RUN cp /app/Dockerfile /app/_build/html/Dockerfile  

RUN cd /app && tar -czf /out.tar.gz _build/html

RUN ls /app/_build

## ... all content was converted to html now and sits in /app/_build
