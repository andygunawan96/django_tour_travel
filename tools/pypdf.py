from PyPDF2.pdf import PdfFileWriter, PdfFileReader
import sys
import math


class PyPDF2(object):
    def crop(self, req_type, file_open, directory, constance_y, constance_x=0, iter_page=[0]):
        input1 = PdfFileReader(open(file_open, "rb"))
        output = PdfFileWriter()
        for iter in range(0, input1.getNumPages()):
            lhs = input1.getPage(iter)
            if iter in iter_page:
                lhs.trimBox.lowerLeft = (lhs.mediaBox.getLowerLeft_x(), lhs.mediaBox.getLowerLeft_y())
                lhs.trimBox.upperRight = (lhs.mediaBox.getUpperRight_x(), lhs.mediaBox.getUpperRight_y())
                lhs.cropBox.lowerLeft = (lhs.mediaBox.getLowerLeft_x() + constance_x, lhs.mediaBox.getLowerLeft_y() + constance_y)
                lhs.cropBox.upperRight = (lhs.mediaBox.getUpperRight_x(), lhs.mediaBox.getUpperRight_y())
            output.addPage(lhs)
            print (str(iter) + " "),
            sys.stdout.flush()

        print("Writing Systems")
        outputStream = file(directory, "wb")
        output.write(outputStream)
        print("Done.")

