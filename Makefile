server-up:
	@echo -e "\n<< access the site in localhost:8000/index.html >>"
	@echo "<< please use firefox >>"
	@echo ""
	@python2.7 -m SimpleHTTPServer

preprocessing:
	@python3.6 src/preprocessing.py

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  clean             to remove build files"
	@echo "  server-up         to run the HTTP Server"
	@echo "  preprocessing     to preprocess the dataset"

clean:
	@find . -name '*~' -exec rm --force  {} +
	@find . -name '*.pyc' -exec rm --force {} +
	@find . -name '*.pyo' -exec rm --force {} +
	@echo "<< Clean ... >>"

