def hitung(self, disc_str, price_unit, product_qty):
		if disc_str and price_unit and product_qty:
			tampung_replace_1 = disc_str.replace(",",".")
			tampung_replace_2 = tampung_replace_1.replace(" ","")
			import re
			tuple_diskon_split = re.split(r'[+]+',tampung_replace_2)
			nett_harga = isNumeric(self,tuple_diskon_split,price_unit)
			disc_amt = (price_unit - nett_harga) * product_qty
			return disc_amt
		else:
			return 0.0
    
def discount_price(self, disc_str, price_unit):
		if disc_str and price_unit:
			tampung_replace_1 = disc_str.replace(",",".")
			tampung_replace_2 = tampung_replace_1.replace(" ","")
			import re
			tuple_diskon_split = re.split(r'[+]+',tampung_replace_2)
			nett_harga = isNumeric(self,tuple_diskon_split,price_unit)
			return price_unit - nett_harga
		else:
			return 0.0
    
def isNumeric(self,tuple_diskon_list,price):
    harga = price
    for i in range(len(tuple_diskon_list)) :
        try :
            float_tuple = float(tuple_diskon_list[i])
            harga = hitungHarga(self,float_tuple,harga,0)
        except ValueError:
            tampung_persen = tuple_diskon_list[i].replace("%","")
            try:
                float_tuple = float(tampung_persen)
                harga = hitungHarga(self,float_tuple,harga,1)
            except ValueError:
                float_tuple = 0
    return harga
        
def hitungHarga(self,jumlah_disc,harga,condition):
    if condition == 0 :
        harga = harga - jumlah_disc
    elif condition == 1 :
        harga = harga * (100 - jumlah_disc) / 100
    return harga
