# bookdeposit-desktop

Applicazione prototipale per la creazione manuale di [Bagit](https://en.wikipedia.org/wiki/BagIt) contenenti documenti elettronici (pdf/epub) e un insieme minimo di metadati bibliografici

![bookdeposit screenshot](http://www.depositolegale.it/wp-content/uploads/2017/10/bookdeposit-screenshot.jpg)


## Uso

* [Scaricare](https://github.com/depositolegale/bookdeposit-desktop/releases) la versione dell'app per il sistema operativo in uso. E' un unico file eseguibile, non necessita di installazione.
* Esecuzione: basterà trascinare un documento epub o pdf sull'applicazione (non sono consentiti altri tipi di formato) e compilare i metadati. Quando i metadati obbligatori saranno correttamente compilati un pulsante permetterà la finalizzazione della bag, salvando un file .zip all'interno della directory **BNCF-Bookdeposit** sul vostro desktop.

## Compilazione da codice sorgente

Requisiti: [nodejs](https://nodejs.org).  
Nota: la compilazione su GNU/Linux necessita di alcuni [ulteriori pacchetti](https://github.com/depositolegale/bookdeposit-desktop/blob/master/.travis.yml#L21). 

* clonare il repository

        git clone https://github.com/depositolegale/bookdeposit-desktop.git
        cd bookdeposit-desktop

* installare le dipendenze

        npm install

* creazione dell'eseguibile

        npm run dist

* l'eseguibile compilato sarà disponibile nella directory `./dist`
