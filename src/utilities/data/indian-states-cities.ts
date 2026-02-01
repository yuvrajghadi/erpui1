// Indian States and Cities Data
// Complete list of all 28 states and 8 union territories with their major cities

export interface City {
  id: string;
  name: string;
  district?: string;
}

export interface State {
  id: string;
  name: string;
  type: 'state' | 'union_territory';
  cities: City[];
}

export const INDIAN_STATES_CITIES: State[] = [
  // States (28)
  {
    id: 'andhra_pradesh',
    name: 'Andhra Pradesh',
    type: 'state',
    cities: [
      { id: 'visakhapatnam', name: 'Visakhapatnam', district: 'Visakhapatnam' },
      { id: 'vijayawada', name: 'Vijayawada', district: 'Krishna' },
      { id: 'guntur', name: 'Guntur', district: 'Guntur' },
      { id: 'nellore', name: 'Nellore', district: 'Nellore' },
      { id: 'kurnool', name: 'Kurnool', district: 'Kurnool' },
      { id: 'rajahmundry', name: 'Rajahmundry', district: 'East Godavari' },
      { id: 'tirupati', name: 'Tirupati', district: 'Chittoor' },
      { id: 'amaravati', name: 'Amaravati', district: 'Guntur' },
      { id: 'anantapur', name: 'Anantapur', district: 'Anantapur' },
      { id: 'chittoor', name: 'Chittoor', district: 'Chittoor' },
      { id: 'kadapa', name: 'Kadapa', district: 'Kadapa' },
      { id: 'eluru', name: 'Eluru', district: 'West Godavari' },
      { id: 'ongole', name: 'Ongole', district: 'Prakasam' },
      { id: 'machilipatnam', name: 'Machilipatnam', district: 'Krishna' },
      { id: 'adoni', name: 'Adoni', district: 'Kurnool' },
      { id: 'tenali', name: 'Tenali', district: 'Guntur' },
      { id: 'proddatur', name: 'Proddatur', district: 'Kadapa' },
      { id: 'hindupur', name: 'Hindupur', district: 'Anantapur' },
      { id: 'bhimavaram', name: 'Bhimavaram', district: 'West Godavari' },
      { id: 'madanapalle', name: 'Madanapalle', district: 'Chittoor' },
      { id: 'guntakal', name: 'Guntakal', district: 'Anantapur' },
      { id: 'dharmavaram', name: 'Dharmavaram', district: 'Anantapur' },
      { id: 'gudivada', name: 'Gudivada', district: 'Krishna' },
      { id: 'narasaraopet', name: 'Narasaraopet', district: 'Guntur' },
      { id: 'tadipatri', name: 'Tadipatri', district: 'Anantapur' },
      { id: 'mangalagiri', name: 'Mangalagiri', district: 'Guntur' },
      { id: 'chilakaluripet', name: 'Chilakaluripet', district: 'Guntur' },
      { id: 'yemmiganur', name: 'Yemmiganur', district: 'Kurnool' },
      { id: 'kadiri', name: 'Kadiri', district: 'Anantapur' },
      { id: 'chirala', name: 'Chirala', district: 'Prakasam' }
    ]
  },
  {
    id: 'arunachal_pradesh',
    name: 'Arunachal Pradesh',
    type: 'state',
    cities: [
      { id: 'itanagar', name: 'Itanagar', district: 'Papum Pare' },
      { id: 'naharlagun', name: 'Naharlagun', district: 'Papum Pare' },
      { id: 'pasighat', name: 'Pasighat', district: 'East Siang' },
      { id: 'tezpur', name: 'Tezpur', district: 'Sonitpur' },
      { id: 'bomdila', name: 'Bomdila', district: 'West Kameng' },
      { id: 'ziro', name: 'Ziro', district: 'Lower Subansiri' },
      { id: 'along', name: 'Along', district: 'West Siang' },
      { id: 'tezu', name: 'Tezu', district: 'Lohit' },
      { id: 'aalo', name: 'Aalo', district: 'West Siang' },
      { id: 'changlang', name: 'Changlang', district: 'Changlang' },
      { id: 'khonsa', name: 'Khonsa', district: 'Tirap' },
      { id: 'roing', name: 'Roing', district: 'Lower Dibang Valley' },
      { id: 'anini', name: 'Anini', district: 'Dibang Valley' },
      { id: 'hawai', name: 'Hawai', district: 'Anjaw' },
      { id: 'namsai', name: 'Namsai', district: 'Namsai' },
      { id: 'daporijo', name: 'Daporijo', district: 'Upper Subansiri' },
      { id: 'yupia', name: 'Yupia', district: 'Papum Pare' },
      { id: 'seppa', name: 'Seppa', district: 'East Kameng' }
    ]
  },
  {
    id: 'assam',
    name: 'Assam',
    type: 'state',
    cities: [
      { id: 'guwahati', name: 'Guwahati', district: 'Kamrup Metropolitan' },
      { id: 'silchar', name: 'Silchar', district: 'Cachar' },
      { id: 'dibrugarh', name: 'Dibrugarh', district: 'Dibrugarh' },
      { id: 'jorhat', name: 'Jorhat', district: 'Jorhat' },
      { id: 'nagaon', name: 'Nagaon', district: 'Nagaon' },
      { id: 'tinsukia', name: 'Tinsukia', district: 'Tinsukia' },
      { id: 'tezpur', name: 'Tezpur', district: 'Sonitpur' },
      { id: 'bongaigaon', name: 'Bongaigaon', district: 'Bongaigaon' },
      { id: 'dhubri', name: 'Dhubri', district: 'Dhubri' },
      { id: 'diphu', name: 'Diphu', district: 'Karbi Anglong' },
      { id: 'north_lakhimpur', name: 'North Lakhimpur', district: 'Lakhimpur' },
      { id: 'karimganj', name: 'Karimganj', district: 'Karimganj' },
      { id: 'sibsagar', name: 'Sibsagar', district: 'Sibsagar' },
      { id: 'goalpara', name: 'Goalpara', district: 'Goalpara' },
      { id: 'barpeta', name: 'Barpeta', district: 'Barpeta' },
      { id: 'mangaldoi', name: 'Mangaldoi', district: 'Darrang' },
      { id: 'haflong', name: 'Haflong', district: 'Dima Hasao' },
      { id: 'kokrajhar', name: 'Kokrajhar', district: 'Kokrajhar' },
      { id: 'hailakandi', name: 'Hailakandi', district: 'Hailakandi' },
      { id: 'morigaon', name: 'Morigaon', district: 'Morigaon' },
      { id: 'nalbari', name: 'Nalbari', district: 'Nalbari' },
      { id: 'dhemaji', name: 'Dhemaji', district: 'Dhemaji' },
      { id: 'udalguri', name: 'Udalguri', district: 'Udalguri' },
      { id: 'baksa', name: 'Baksa', district: 'Baksa' },
      { id: 'chirang', name: 'Chirang', district: 'Chirang' }
    ]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    type: 'state',
    cities: [
      { id: 'patna', name: 'Patna', district: 'Patna' },
      { id: 'gaya', name: 'Gaya', district: 'Gaya' },
      { id: 'bhagalpur', name: 'Bhagalpur', district: 'Bhagalpur' },
      { id: 'muzaffarpur', name: 'Muzaffarpur', district: 'Muzaffarpur' },
      { id: 'darbhanga', name: 'Darbhanga', district: 'Darbhanga' },
      { id: 'bihar_sharif', name: 'Bihar Sharif', district: 'Nalanda' },
      { id: 'arrah', name: 'Arrah', district: 'Bhojpur' },
      { id: 'begusarai', name: 'Begusarai', district: 'Begusarai' },
      { id: 'katihar', name: 'Katihar', district: 'Katihar' },
      { id: 'munger', name: 'Munger', district: 'Munger' },
      { id: 'chhapra', name: 'Chhapra', district: 'Saran' },
      { id: 'purnia', name: 'Purnia', district: 'Purnia' },
      { id: 'saharsa', name: 'Saharsa', district: 'Saharsa' },
      { id: 'sasaram', name: 'Sasaram', district: 'Rohtas' },
      { id: 'hajipur', name: 'Hajipur', district: 'Vaishali' },
      { id: 'dehri', name: 'Dehri', district: 'Rohtas' },
      { id: 'siwan', name: 'Siwan', district: 'Siwan' },
      { id: 'motihari', name: 'Motihari', district: 'East Champaran' },
      { id: 'nawada', name: 'Nawada', district: 'Nawada' },
      { id: 'bagaha', name: 'Bagaha', district: 'West Champaran' },
      { id: 'buxar', name: 'Buxar', district: 'Buxar' },
      { id: 'kishanganj', name: 'Kishanganj', district: 'Kishanganj' },
      { id: 'sitamarhi', name: 'Sitamarhi', district: 'Sitamarhi' },
      { id: 'jamalpur', name: 'Jamalpur', district: 'Munger' },
      { id: 'jehanabad', name: 'Jehanabad', district: 'Jehanabad' },
      { id: 'aurangabad_bihar', name: 'Aurangabad', district: 'Aurangabad' },
      { id: 'madhubani', name: 'Madhubani', district: 'Madhubani' },
      { id: 'betiah', name: 'Betiah', district: 'West Champaran' },
      { id: 'khagaria', name: 'Khagaria', district: 'Khagaria' },
      { id: 'lakhisarai', name: 'Lakhisarai', district: 'Lakhisarai' }
    ]
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    type: 'state',
    cities: [
      { id: 'raipur', name: 'Raipur', district: 'Raipur' },
      { id: 'bilaspur', name: 'Bilaspur', district: 'Bilaspur' },
      { id: 'korba', name: 'Korba', district: 'Korba' },
      { id: 'durg', name: 'Durg', district: 'Durg' },
      { id: 'bhilai', name: 'Bhilai', district: 'Durg' },
      { id: 'rajnandgaon', name: 'Rajnandgaon', district: 'Rajnandgaon' },
      { id: 'jagdalpur', name: 'Jagdalpur', district: 'Bastar' },
      { id: 'ambikapur', name: 'Ambikapur', district: 'Surguja' },
      { id: 'dhamtari', name: 'Dhamtari', district: 'Dhamtari' },
      { id: 'mahasamund', name: 'Mahasamund', district: 'Mahasamund' },
      { id: 'raigarh', name: 'Raigarh', district: 'Raigarh' },
      { id: 'janjgir', name: 'Janjgir-Champa', district: 'Janjgir-Champa' },
      { id: 'kanker', name: 'Kanker', district: 'Kanker' },
      { id: 'kawardha', name: 'Kawardha', district: 'Kabirdham' },
      { id: 'jashpur', name: 'Jashpur', district: 'Jashpur' },
      { id: 'korea', name: 'Korea', district: 'Korea' },
      { id: 'narayanpur', name: 'Narayanpur', district: 'Narayanpur' },
      { id: 'bastar', name: 'Bastar', district: 'Bastar' },
      { id: 'bijapur_cg', name: 'Bijapur', district: 'Bijapur' },
      { id: 'dantewada', name: 'Dantewada', district: 'Dantewada' },
      { id: 'sukma', name: 'Sukma', district: 'Sukma' },
      { id: 'kondagaon', name: 'Kondagaon', district: 'Kondagaon' },
      { id: 'balrampur', name: 'Balrampur', district: 'Balrampur' },
      { id: 'surajpur', name: 'Surajpur', district: 'Surajpur' },
      { id: 'baloda_bazar', name: 'Baloda Bazar', district: 'Baloda Bazar' }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    type: 'state',
    cities: [
      { id: 'panaji', name: 'Panaji', district: 'North Goa' },
      { id: 'vasco_da_gama', name: 'Vasco da Gama', district: 'South Goa' },
      { id: 'margao', name: 'Margao', district: 'South Goa' },
      { id: 'mapusa', name: 'Mapusa', district: 'North Goa' },
      { id: 'ponda', name: 'Ponda', district: 'North Goa' },
      { id: 'bicholim', name: 'Bicholim', district: 'North Goa' },
      { id: 'curchorem', name: 'Curchorem', district: 'South Goa' },
      { id: 'sanquelim', name: 'Sanquelim', district: 'North Goa' }
    ]
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    type: 'state',
    cities: [
      { id: 'ahmedabad', name: 'Ahmedabad', district: 'Ahmedabad' },
      { id: 'surat', name: 'Surat', district: 'Surat' },
      { id: 'vadodara', name: 'Vadodara', district: 'Vadodara' },
      { id: 'rajkot', name: 'Rajkot', district: 'Rajkot' },
      { id: 'bhavnagar', name: 'Bhavnagar', district: 'Bhavnagar' },
      { id: 'jamnagar', name: 'Jamnagar', district: 'Jamnagar' },
      { id: 'gandhinagar', name: 'Gandhinagar', district: 'Gandhinagar' },
      { id: 'junagadh', name: 'Junagadh', district: 'Junagadh' },
      { id: 'gandhidham', name: 'Gandhidham', district: 'Kutch' },
      { id: 'anand', name: 'Anand', district: 'Anand' },
      { id: 'morbi', name: 'Morbi', district: 'Morbi' },
      { id: 'nadiad', name: 'Nadiad', district: 'Kheda' },
      { id: 'bharuch', name: 'Bharuch', district: 'Bharuch' },
      { id: 'vapi', name: 'Vapi', district: 'Valsad' },
      { id: 'navsari', name: 'Navsari', district: 'Navsari' },
      { id: 'veraval', name: 'Veraval', district: 'Gir Somnath' },
      { id: 'porbandar', name: 'Porbandar', district: 'Porbandar' },
      { id: 'godhra', name: 'Godhra', district: 'Panchmahal' },
      { id: 'bhuj', name: 'Bhuj', district: 'Kutch' },
      { id: 'palanpur', name: 'Palanpur', district: 'Banaskantha' },
      { id: 'valsad', name: 'Valsad', district: 'Valsad' },
      { id: 'patan', name: 'Patan', district: 'Patan' },
      { id: 'deesa', name: 'Deesa', district: 'Banaskantha' },
      { id: 'mehsana', name: 'Mehsana', district: 'Mehsana' },
      { id: 'surendranagar', name: 'Surendranagar', district: 'Surendranagar' },
      { id: 'bhavnagar_rural', name: 'Mahuva', district: 'Bhavnagar' },
      { id: 'upleta', name: 'Upleta', district: 'Rajkot' },
      { id: 'jetpur', name: 'Jetpur', district: 'Rajkot' },
      { id: 'gondal', name: 'Gondal', district: 'Rajkot' },
      { id: 'amreli', name: 'Amreli', district: 'Amreli' }
    ]
  },
  {
    id: 'haryana',
    name: 'Haryana',
    type: 'state',
    cities: [
      { id: 'faridabad', name: 'Faridabad', district: 'Faridabad' },
      { id: 'gurgaon', name: 'Gurgaon', district: 'Gurgaon' },
      { id: 'hisar', name: 'Hisar', district: 'Hisar' },
      { id: 'rohtak', name: 'Rohtak', district: 'Rohtak' },
      { id: 'panipat', name: 'Panipat', district: 'Panipat' },
      { id: 'karnal', name: 'Karnal', district: 'Karnal' },
      { id: 'sonipat', name: 'Sonipat', district: 'Sonipat' },
      { id: 'yamunanagar', name: 'Yamunanagar', district: 'Yamunanagar' },
      { id: 'panchkula', name: 'Panchkula', district: 'Panchkula' },
      { id: 'bhiwani', name: 'Bhiwani', district: 'Bhiwani' },
      { id: 'sirsa', name: 'Sirsa', district: 'Sirsa' },
      { id: 'jind', name: 'Jind', district: 'Jind' }
    ]
  },
  {
    id: 'himachal_pradesh',
    name: 'Himachal Pradesh',
    type: 'state',
    cities: [
      { id: 'shimla', name: 'Shimla', district: 'Shimla' },
      { id: 'dharamshala', name: 'Dharamshala', district: 'Kangra' },
      { id: 'solan', name: 'Solan', district: 'Solan' },
      { id: 'mandi', name: 'Mandi', district: 'Mandi' },
      { id: 'kullu', name: 'Kullu', district: 'Kullu' },
      { id: 'hamirpur', name: 'Hamirpur', district: 'Hamirpur' },
      { id: 'una', name: 'Una', district: 'Una' },
      { id: 'bilaspur_hp', name: 'Bilaspur', district: 'Bilaspur' },
      { id: 'chamba', name: 'Chamba', district: 'Chamba' },
      { id: 'palampur', name: 'Palampur', district: 'Kangra' }
    ]
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    type: 'state',
    cities: [
      { id: 'ranchi', name: 'Ranchi', district: 'Ranchi' },
      { id: 'jamshedpur', name: 'Jamshedpur', district: 'East Singhbhum' },
      { id: 'dhanbad', name: 'Dhanbad', district: 'Dhanbad' },
      { id: 'bokaro', name: 'Bokaro Steel City', district: 'Bokaro' },
      { id: 'deoghar', name: 'Deoghar', district: 'Deoghar' },
      { id: 'phusro', name: 'Phusro', district: 'Bokaro' },
      { id: 'hazaribagh', name: 'Hazaribagh', district: 'Hazaribagh' },
      { id: 'giridih', name: 'Giridih', district: 'Giridih' },
      { id: 'ramgarh', name: 'Ramgarh', district: 'Ramgarh' },
      { id: 'medininagar', name: 'Medininagar', district: 'Palamu' }
    ]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    type: 'state',
    cities: [
      { id: 'bangalore', name: 'Bangalore', district: 'Bangalore Urban' },
      { id: 'mysore', name: 'Mysore', district: 'Mysore' },
      { id: 'hubli', name: 'Hubli-Dharwad', district: 'Dharwad' },
      { id: 'mangalore', name: 'Mangalore', district: 'Dakshina Kannada' },
      { id: 'belgaum', name: 'Belgaum', district: 'Belgaum' },
      { id: 'gulbarga', name: 'Gulbarga', district: 'Gulbarga' },
      { id: 'davanagere', name: 'Davanagere', district: 'Davanagere' },
      { id: 'bellary', name: 'Bellary', district: 'Bellary' },
      { id: 'bijapur', name: 'Bijapur', district: 'Bijapur' },
      { id: 'shimoga', name: 'Shimoga', district: 'Shimoga' },
      { id: 'tumkur', name: 'Tumkur', district: 'Tumkur' },
      { id: 'raichur', name: 'Raichur', district: 'Raichur' },
      { id: 'bidar', name: 'Bidar', district: 'Bidar' },
      { id: 'hospet', name: 'Hospet', district: 'Bellary' },
      { id: 'gadag_betageri', name: 'Gadag-Betageri', district: 'Gadag' },
      { id: 'udupi', name: 'Udupi', district: 'Udupi' },
      { id: 'robertson_pet', name: 'Robertson Pet', district: 'Kolar' },
      { id: 'kolar', name: 'Kolar', district: 'Kolar' },
      { id: 'mandya', name: 'Mandya', district: 'Mandya' },
      { id: 'hassan', name: 'Hassan', district: 'Hassan' },
      { id: 'bhadravati', name: 'Bhadravati', district: 'Shimoga' },
      { id: 'chitradurga', name: 'Chitradurga', district: 'Chitradurga' },
      { id: 'karwar', name: 'Karwar', district: 'Uttara Kannada' },
      { id: 'ranebennuru', name: 'Ranebennuru', district: 'Haveri' },
      { id: 'gangavati', name: 'Gangavati', district: 'Koppal' },
      { id: 'bagalkot', name: 'Bagalkot', district: 'Bagalkot' },
      { id: 'sirsi', name: 'Sirsi', district: 'Uttara Kannada' },
      { id: 'davangere', name: 'Davangere', district: 'Davanagere' },
      { id: 'koppal', name: 'Koppal', district: 'Koppal' },
      { id: 'sagara', name: 'Sagara', district: 'Shimoga' },
      { id: 'yadgir', name: 'Yadgir', district: 'Yadgir' },
      { id: 'chikkamagaluru', name: 'Chikkamagaluru', district: 'Chikkamagaluru' },
      { id: 'chikkaballapur', name: 'Chikkaballapur', district: 'Chikkaballapur' },
      { id: 'ramanagara', name: 'Ramanagara', district: 'Ramanagara' },
      { id: 'chamarajanagar', name: 'Chamarajanagar', district: 'Chamarajanagar' }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala',
    type: 'state',
    cities: [
      { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', district: 'Thiruvananthapuram' },
      { id: 'kochi', name: 'Kochi', district: 'Ernakulam' },
      { id: 'kozhikode', name: 'Kozhikode', district: 'Kozhikode' },
      { id: 'kollam', name: 'Kollam', district: 'Kollam' },
      { id: 'thrissur', name: 'Thrissur', district: 'Thrissur' },
      { id: 'alappuzha', name: 'Alappuzha', district: 'Alappuzha' },
      { id: 'palakkad', name: 'Palakkad', district: 'Palakkad' },
      { id: 'kannur', name: 'Kannur', district: 'Kannur' },
      { id: 'kottayam', name: 'Kottayam', district: 'Kottayam' },
      { id: 'malappuram', name: 'Malappuram', district: 'Malappuram' },
      { id: 'kasaragod', name: 'Kasaragod', district: 'Kasaragod' },
      { id: 'pathanamthitta', name: 'Pathanamthitta', district: 'Pathanamthitta' }
    ]
  },
  {
    id: 'madhya_pradesh',
    name: 'Madhya Pradesh',
    type: 'state',
    cities: [
      { id: 'bhopal', name: 'Bhopal', district: 'Bhopal' },
      { id: 'indore', name: 'Indore', district: 'Indore' },
      { id: 'gwalior', name: 'Gwalior', district: 'Gwalior' },
      { id: 'jabalpur', name: 'Jabalpur', district: 'Jabalpur' },
      { id: 'ujjain', name: 'Ujjain', district: 'Ujjain' },
      { id: 'sagar', name: 'Sagar', district: 'Sagar' },
      { id: 'dewas', name: 'Dewas', district: 'Dewas' },
      { id: 'satna', name: 'Satna', district: 'Satna' },
      { id: 'ratlam', name: 'Ratlam', district: 'Ratlam' },
      { id: 'rewa', name: 'Rewa', district: 'Rewa' },
      { id: 'guna', name: 'Guna', district: 'Guna' },
      { id: 'singrauli', name: 'Singrauli', district: 'Singrauli' }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    type: 'state',
    cities: [
      { id: 'mumbai', name: 'Mumbai', district: 'Mumbai City' },
      { id: 'pune', name: 'Pune', district: 'Pune' },
      { id: 'nagpur', name: 'Nagpur', district: 'Nagpur' },
      { id: 'thane', name: 'Thane', district: 'Thane' },
      { id: 'nashik', name: 'Nashik', district: 'Nashik' },
      { id: 'aurangabad', name: 'Aurangabad', district: 'Aurangabad' },
      { id: 'solapur', name: 'Solapur', district: 'Solapur' },
      { id: 'amravati', name: 'Amravati', district: 'Amravati' },
      { id: 'nanded', name: 'Nanded', district: 'Nanded' },
      { id: 'kolhapur', name: 'Kolhapur', district: 'Kolhapur' },
      { id: 'akola', name: 'Akola', district: 'Akola' },
      { id: 'latur', name: 'Latur', district: 'Latur' },
      { id: 'dhule', name: 'Dhule', district: 'Dhule' },
      { id: 'ahmednagar', name: 'Ahmednagar', district: 'Ahmednagar' },
      { id: 'ichalkaranji', name: 'Ichalkaranji', district: 'Kolhapur' },
      { id: 'jalgaon', name: 'Jalgaon', district: 'Jalgaon' },
      { id: 'malegaon', name: 'Malegaon', district: 'Nashik' },
      { id: 'akot', name: 'Akot', district: 'Akola' },
      { id: 'navi_mumbai', name: 'Navi Mumbai', district: 'Thane' },
      { id: 'sangli', name: 'Sangli', district: 'Sangli' },
      { id: 'miraj', name: 'Miraj', district: 'Sangli' },
      { id: 'kalyan_dombivli', name: 'Kalyan-Dombivli', district: 'Thane' },
      { id: 'vasai_virar', name: 'Vasai-Virar', district: 'Palghar' },
      { id: 'satara', name: 'Satara', district: 'Satara' },
      { id: 'wardha', name: 'Wardha', district: 'Wardha' },
      { id: 'bid', name: 'Bid', district: 'Beed' },
      { id: 'yavatmal', name: 'Yavatmal', district: 'Yavatmal' },
      { id: 'achalpur', name: 'Achalpur', district: 'Amravati' },
      { id: 'osmanabad', name: 'Osmanabad', district: 'Osmanabad' },
      { id: 'nandurbar', name: 'Nandurbar', district: 'Nandurbar' },
      { id: 'chandrapur', name: 'Chandrapur', district: 'Chandrapur' },
      { id: 'jalna', name: 'Jalna', district: 'Jalna' },
      { id: 'bhusawal', name: 'Bhusawal', district: 'Jalgaon' },
      { id: 'panvel', name: 'Panvel', district: 'Raigad' },
      { id: 'gondia', name: 'Gondia', district: 'Gondia' },
      { id: 'bhandara', name: 'Bhandara', district: 'Bhandara' },
      { id: 'washim', name: 'Washim', district: 'Washim' },
      { id: 'hinganghat', name: 'Hinganghat', district: 'Wardha' },
      { id: 'parli', name: 'Parli', district: 'Beed' },
      { id: 'parbhani', name: 'Parbhani', district: 'Parbhani' }
    ]
  },
  {
    id: 'manipur',
    name: 'Manipur',
    type: 'state',
    cities: [
      { id: 'imphal', name: 'Imphal', district: 'Imphal West' },
      { id: 'thoubal', name: 'Thoubal', district: 'Thoubal' },
      { id: 'bishnupur', name: 'Bishnupur', district: 'Bishnupur' },
      { id: 'churachandpur', name: 'Churachandpur', district: 'Churachandpur' },
      { id: 'ukhrul', name: 'Ukhrul', district: 'Ukhrul' },
      { id: 'senapati', name: 'Senapati', district: 'Senapati' },
      { id: 'tamenglong', name: 'Tamenglong', district: 'Tamenglong' },
      { id: 'chandel', name: 'Chandel', district: 'Chandel' }
    ]
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    type: 'state',
    cities: [
      { id: 'shillong', name: 'Shillong', district: 'East Khasi Hills' },
      { id: 'tura', name: 'Tura', district: 'West Garo Hills' },
      { id: 'cherrapunji', name: 'Cherrapunji', district: 'East Khasi Hills' },
      { id: 'jowai', name: 'Jowai', district: 'West Jaintia Hills' },
      { id: 'nongpoh', name: 'Nongpoh', district: 'Ri Bhoi' },
      { id: 'baghmara', name: 'Baghmara', district: 'South Garo Hills' },
      { id: 'williamnagar', name: 'Williamnagar', district: 'East Garo Hills' },
      { id: 'resubelpara', name: 'Resubelpara', district: 'North Garo Hills' }
    ]
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    type: 'state',
    cities: [
      { id: 'aizawl', name: 'Aizawl', district: 'Aizawl' },
      { id: 'lunglei', name: 'Lunglei', district: 'Lunglei' },
      { id: 'champhai', name: 'Champhai', district: 'Champhai' },
      { id: 'serchhip', name: 'Serchhip', district: 'Serchhip' },
      { id: 'kolasib', name: 'Kolasib', district: 'Kolasib' },
      { id: 'lawngtlai', name: 'Lawngtlai', district: 'Lawngtlai' },
      { id: 'mamit', name: 'Mamit', district: 'Mamit' },
      { id: 'saiha', name: 'Saiha', district: 'Saiha' }
    ]
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    type: 'state',
    cities: [
      { id: 'kohima', name: 'Kohima', district: 'Kohima' },
      { id: 'dimapur', name: 'Dimapur', district: 'Dimapur' },
      { id: 'mokokchung', name: 'Mokokchung', district: 'Mokokchung' },
      { id: 'tuensang', name: 'Tuensang', district: 'Tuensang' },
      { id: 'wokha', name: 'Wokha', district: 'Wokha' },
      { id: 'zunheboto', name: 'Zunheboto', district: 'Zunheboto' },
      { id: 'phek', name: 'Phek', district: 'Phek' },
      { id: 'mon', name: 'Mon', district: 'Mon' }
    ]
  },
  {
    id: 'odisha',
    name: 'Odisha',
    type: 'state',
    cities: [
      { id: 'bhubaneswar', name: 'Bhubaneswar', district: 'Khordha' },
      { id: 'cuttack', name: 'Cuttack', district: 'Cuttack' },
      { id: 'rourkela', name: 'Rourkela', district: 'Sundargarh' },
      { id: 'brahmapur', name: 'Brahmapur', district: 'Ganjam' },
      { id: 'sambalpur', name: 'Sambalpur', district: 'Sambalpur' },
      { id: 'puri', name: 'Puri', district: 'Puri' },
      { id: 'balasore', name: 'Balasore', district: 'Balasore' },
      { id: 'bhadrak', name: 'Bhadrak', district: 'Bhadrak' },
      { id: 'baripada', name: 'Baripada', district: 'Mayurbhanj' },
      { id: 'jharsuguda', name: 'Jharsuguda', district: 'Jharsuguda' }
    ]
  },
  {
    id: 'punjab',
    name: 'Punjab',
    type: 'state',
    cities: [
      { id: 'ludhiana', name: 'Ludhiana', district: 'Ludhiana' },
      { id: 'amritsar', name: 'Amritsar', district: 'Amritsar' },
      { id: 'jalandhar', name: 'Jalandhar', district: 'Jalandhar' },
      { id: 'patiala', name: 'Patiala', district: 'Patiala' },
      { id: 'bathinda', name: 'Bathinda', district: 'Bathinda' },
      { id: 'mohali', name: 'Mohali', district: 'Mohali' },
      { id: 'firozpur', name: 'Firozpur', district: 'Firozpur' },
      { id: 'batala', name: 'Batala', district: 'Gurdaspur' },
      { id: 'pathankot', name: 'Pathankot', district: 'Pathankot' },
      { id: 'hoshiarpur', name: 'Hoshiarpur', district: 'Hoshiarpur' },
      { id: 'malerkotla', name: 'Malerkotla', district: 'Malerkotla' },
      { id: 'khanna', name: 'Khanna', district: 'Ludhiana' }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    type: 'state',
    cities: [
      { id: 'jaipur', name: 'Jaipur', district: 'Jaipur' },
      { id: 'jodhpur', name: 'Jodhpur', district: 'Jodhpur' },
      { id: 'kota', name: 'Kota', district: 'Kota' },
      { id: 'bikaner', name: 'Bikaner', district: 'Bikaner' },
      { id: 'udaipur', name: 'Udaipur', district: 'Udaipur' },
      { id: 'ajmer', name: 'Ajmer', district: 'Ajmer' },
      { id: 'bhilwara', name: 'Bhilwara', district: 'Bhilwara' },
      { id: 'alwar', name: 'Alwar', district: 'Alwar' },
      { id: 'bharatpur', name: 'Bharatpur', district: 'Bharatpur' },
      { id: 'sikar', name: 'Sikar', district: 'Sikar' },
      { id: 'pali', name: 'Pali', district: 'Pali' },
      { id: 'sri_ganganagar', name: 'Sri Ganganagar', district: 'Sri Ganganagar' },
      { id: 'kishangarh', name: 'Kishangarh', district: 'Ajmer' },
      { id: 'beawar', name: 'Beawar', district: 'Ajmer' }
    ]
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    type: 'state',
    cities: [
      { id: 'gangtok', name: 'Gangtok', district: 'East Sikkim' },
      { id: 'namchi', name: 'Namchi', district: 'South Sikkim' },
      { id: 'gyalshing', name: 'Gyalshing', district: 'West Sikkim' },
      { id: 'mangan', name: 'Mangan', district: 'North Sikkim' },
      { id: 'jorethang', name: 'Jorethang', district: 'South Sikkim' },
      { id: 'nayabazar', name: 'Nayabazar', district: 'South Sikkim' },
      { id: 'rangpo', name: 'Rangpo', district: 'East Sikkim' },
      { id: 'singtam', name: 'Singtam', district: 'East Sikkim' }
    ]
  },
  {
    id: 'tamil_nadu',
    name: 'Tamil Nadu',
    type: 'state',
    cities: [
      { id: 'chennai', name: 'Chennai', district: 'Chennai' },
      { id: 'coimbatore', name: 'Coimbatore', district: 'Coimbatore' },
      { id: 'madurai', name: 'Madurai', district: 'Madurai' },
      { id: 'tiruchirappalli', name: 'Tiruchirappalli', district: 'Tiruchirappalli' },
      { id: 'salem', name: 'Salem', district: 'Salem' },
      { id: 'tirunelveli', name: 'Tirunelveli', district: 'Tirunelveli' },
      { id: 'tiruppur', name: 'Tiruppur', district: 'Tiruppur' },
      { id: 'vellore', name: 'Vellore', district: 'Vellore' },
      { id: 'erode', name: 'Erode', district: 'Erode' },
      { id: 'thoothukkudi', name: 'Thoothukkudi', district: 'Thoothukkudi' },
      { id: 'dindigul', name: 'Dindigul', district: 'Dindigul' },
      { id: 'thanjavur', name: 'Thanjavur', district: 'Thanjavur' },
      { id: 'ranipet', name: 'Ranipet', district: 'Ranipet' },
      { id: 'sivakasi', name: 'Sivakasi', district: 'Virudhunagar' },
      { id: 'karur', name: 'Karur', district: 'Karur' },
      { id: 'udhagamandalam', name: 'Udhagamandalam (Ooty)', district: 'Nilgiris' },
      { id: 'nagercoil', name: 'Nagercoil', district: 'Kanyakumari' },
      { id: 'kumbakonam', name: 'Kumbakonam', district: 'Thanjavur' },
      { id: 'tiruvannamalai', name: 'Tiruvannamalai', district: 'Tiruvannamalai' },
      { id: 'pollachi', name: 'Pollachi', district: 'Coimbatore' },
      { id: 'rajapalayam', name: 'Rajapalayam', district: 'Virudhunagar' },
      { id: 'pudukkottai', name: 'Pudukkottai', district: 'Pudukkottai' },
      { id: 'ambur', name: 'Ambur', district: 'Tirupattur' },
      { id: 'hosur', name: 'Hosur', district: 'Krishnagiri' },
      { id: 'dharapuram', name: 'Dharapuram', district: 'Tiruppur' },
      { id: 'kanchipuram', name: 'Kanchipuram', district: 'Kanchipuram' },
      { id: 'cuddalore', name: 'Cuddalore', district: 'Cuddalore' },
      { id: 'neyveli', name: 'Neyveli', district: 'Cuddalore' },
      { id: 'nagapattinam', name: 'Nagapattinam', district: 'Nagapattinam' },
      { id: 'viluppuram', name: 'Viluppuram', district: 'Viluppuram' },
      { id: 'namakkal', name: 'Namakkal', district: 'Namakkal' },
      { id: 'theni', name: 'Theni', district: 'Theni' },
      { id: 'gudiyatham', name: 'Gudiyatham', district: 'Vellore' },
      { id: 'ariyalur', name: 'Ariyalur', district: 'Ariyalur' },
      { id: 'krishnagiri', name: 'Krishnagiri', district: 'Krishnagiri' },
      { id: 'vaniyambadi', name: 'Vaniyambadi', district: 'Tirupattur' },
      { id: 'mettupalayam', name: 'Mettupalayam', district: 'Coimbatore' },
      { id: 'arakkonam', name: 'Arakkonam', district: 'Ranipet' },
      { id: 'perambalur', name: 'Perambalur', district: 'Perambalur' },
      { id: 'kanyakumari', name: 'Kanyakumari', district: 'Kanyakumari' }
    ]
  },
  {
    id: 'telangana',
    name: 'Telangana',
    type: 'state',
    cities: [
      { id: 'hyderabad', name: 'Hyderabad', district: 'Hyderabad' },
      { id: 'warangal', name: 'Warangal', district: 'Warangal Urban' },
      { id: 'nizamabad', name: 'Nizamabad', district: 'Nizamabad' },
      { id: 'khammam', name: 'Khammam', district: 'Khammam' },
      { id: 'karimnagar', name: 'Karimnagar', district: 'Karimnagar' },
      { id: 'ramagundam', name: 'Ramagundam', district: 'Peddapalli' },
      { id: 'mahabubnagar', name: 'Mahabubnagar', district: 'Mahabubnagar' },
      { id: 'nalgonda', name: 'Nalgonda', district: 'Nalgonda' },
      { id: 'adilabad', name: 'Adilabad', district: 'Adilabad' },
      { id: 'suryapet', name: 'Suryapet', district: 'Suryapet' },
      { id: 'miryalaguda', name: 'Miryalaguda', district: 'Nalgonda' },
      { id: 'jagtial', name: 'Jagtial', district: 'Jagtial' }
    ]
  },
  {
    id: 'tripura',
    name: 'Tripura',
    type: 'state',
    cities: [
      { id: 'agartala', name: 'Agartala', district: 'West Tripura' },
      { id: 'dharmanagar', name: 'Dharmanagar', district: 'North Tripura' },
      { id: 'udaipur_tripura', name: 'Udaipur', district: 'Gomati' },
      { id: 'kailasahar', name: 'Kailasahar', district: 'Unakoti' },
      { id: 'belonia', name: 'Belonia', district: 'South Tripura' },
      { id: 'khowai', name: 'Khowai', district: 'Khowai' },
      { id: 'ambassa', name: 'Ambassa', district: 'Dhalai' },
      { id: 'sabroom', name: 'Sabroom', district: 'South Tripura' }
    ]
  },
  {
    id: 'uttar_pradesh',
    name: 'Uttar Pradesh',
    type: 'state',
    cities: [
      { id: 'lucknow', name: 'Lucknow', district: 'Lucknow' },
      { id: 'kanpur', name: 'Kanpur', district: 'Kanpur Nagar' },
      { id: 'ghaziabad', name: 'Ghaziabad', district: 'Ghaziabad' },
      { id: 'agra', name: 'Agra', district: 'Agra' },
      { id: 'meerut', name: 'Meerut', district: 'Meerut' },
      { id: 'varanasi', name: 'Varanasi', district: 'Varanasi' },
      { id: 'allahabad', name: 'Allahabad', district: 'Allahabad' },
      { id: 'bareilly', name: 'Bareilly', district: 'Bareilly' },
      { id: 'aligarh', name: 'Aligarh', district: 'Aligarh' },
      { id: 'moradabad', name: 'Moradabad', district: 'Moradabad' },
      { id: 'saharanpur', name: 'Saharanpur', district: 'Saharanpur' },
      { id: 'gorakhpur', name: 'Gorakhpur', district: 'Gorakhpur' },
      { id: 'noida', name: 'Noida', district: 'Gautam Buddha Nagar' },
      { id: 'firozabad', name: 'Firozabad', district: 'Firozabad' },
      { id: 'jhansi', name: 'Jhansi', district: 'Jhansi' },
      { id: 'muzaffarnagar', name: 'Muzaffarnagar', district: 'Muzaffarnagar' },
      { id: 'mathura', name: 'Mathura', district: 'Mathura' },
      { id: 'rampur', name: 'Rampur', district: 'Rampur' },
      { id: 'shahjahanpur', name: 'Shahjahanpur', district: 'Shahjahanpur' },
      { id: 'farrukhabad', name: 'Farrukhabad-Fatehgarh', district: 'Farrukhabad' },
      { id: 'hapur', name: 'Hapur', district: 'Hapur' },
      { id: 'etawah', name: 'Etawah', district: 'Etawah' },
      { id: 'mirzapur', name: 'Mirzapur-Vindhyachal', district: 'Mirzapur' },
      { id: 'bulandshahr', name: 'Bulandshahr', district: 'Bulandshahr' },
      { id: 'sambhal', name: 'Sambhal', district: 'Sambhal' },
      { id: 'amroha', name: 'Amroha', district: 'Amroha' },
      { id: 'hardoi', name: 'Hardoi', district: 'Hardoi' },
      { id: 'fatehpur', name: 'Fatehpur', district: 'Fatehpur' },
      { id: 'raebareli', name: 'Raebareli', district: 'Raebareli' },
      { id: 'orai', name: 'Orai', district: 'Jalaun' },
      { id: 'sitapur', name: 'Sitapur', district: 'Sitapur' },
      { id: 'bahraich', name: 'Bahraich', district: 'Bahraich' },
      { id: 'modinagar', name: 'Modinagar', district: 'Ghaziabad' },
      { id: 'unnao', name: 'Unnao', district: 'Unnao' },
      { id: 'jaunpur', name: 'Jaunpur', district: 'Jaunpur' },
      { id: 'lakhimpur', name: 'Lakhimpur', district: 'Lakhimpur Kheri' },
      { id: 'hathras', name: 'Hathras', district: 'Hathras' },
      { id: 'banda', name: 'Banda', district: 'Banda' },
      { id: 'pilibhit', name: 'Pilibhit', district: 'Pilibhit' },
      { id: 'barabanki', name: 'Barabanki', district: 'Barabanki' },
      { id: 'khurja', name: 'Khurja', district: 'Bulandshahr' },
      { id: 'gonda', name: 'Gonda', district: 'Gonda' },
      { id: 'mainpuri', name: 'Mainpuri', district: 'Mainpuri' },
      { id: 'lalitpur', name: 'Lalitpur', district: 'Lalitpur' },
      { id: 'etah', name: 'Etah', district: 'Etah' },
      { id: 'deoria', name: 'Deoria', district: 'Deoria' },
      { id: 'ujhani', name: 'Ujhani', district: 'Budaun' },
      { id: 'ghazipur', name: 'Ghazipur', district: 'Ghazipur' },
      { id: 'sultanpur', name: 'Sultanpur', district: 'Sultanpur' },
      { id: 'azamgarh', name: 'Azamgarh', district: 'Azamgarh' },
      { id: 'bijnor', name: 'Bijnor', district: 'Bijnor' }
    ]
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    type: 'state',
    cities: [
      { id: 'dehradun', name: 'Dehradun', district: 'Dehradun' },
      { id: 'haridwar', name: 'Haridwar', district: 'Haridwar' },
      { id: 'roorkee', name: 'Roorkee', district: 'Haridwar' },
      { id: 'haldwani', name: 'Haldwani-cum-Kathgodam', district: 'Nainital' },
      { id: 'rudrapur', name: 'Rudrapur', district: 'Udham Singh Nagar' },
      { id: 'kashipur', name: 'Kashipur', district: 'Udham Singh Nagar' },
      { id: 'rishikesh', name: 'Rishikesh', district: 'Dehradun' },
      { id: 'kotdwar', name: 'Kotdwar', district: 'Pauri Garhwal' },
      { id: 'pithoragarh', name: 'Pithoragarh', district: 'Pithoragarh' },
      { id: 'almora', name: 'Almora', district: 'Almora' }
    ]
  },
  {
    id: 'west_bengal',
    name: 'West Bengal',
    type: 'state',
    cities: [
      { id: 'kolkata', name: 'Kolkata', district: 'Kolkata' },
      { id: 'howrah', name: 'Howrah', district: 'Howrah' },
      { id: 'durgapur', name: 'Durgapur', district: 'Paschim Bardhaman' },
      { id: 'asansol', name: 'Asansol', district: 'Paschim Bardhaman' },
      { id: 'siliguri', name: 'Siliguri', district: 'Darjeeling' },
      { id: 'bardhaman', name: 'Bardhaman', district: 'Purba Bardhaman' },
      { id: 'malda', name: 'Malda', district: 'Malda' },
      { id: 'baharampur', name: 'Baharampur', district: 'Murshidabad' },
      { id: 'habra', name: 'Habra', district: 'North 24 Parganas' },
      { id: 'kharagpur', name: 'Kharagpur', district: 'Paschim Medinipur' },
      { id: 'shantipur', name: 'Shantipur', district: 'Nadia' },
      { id: 'dankuni', name: 'Dankuni', district: 'Hooghly' },
      { id: 'dhulian', name: 'Dhulian', district: 'Murshidabad' },
      { id: 'ranaghat', name: 'Ranaghat', district: 'Nadia' },
      { id: 'haldia', name: 'Haldia', district: 'Purba Medinipur' },
      { id: 'raiganj', name: 'Raiganj', district: 'Uttar Dinajpur' },
      { id: 'krishnanagar', name: 'Krishnanagar', district: 'Nadia' },
      { id: 'nabadwip', name: 'Nabadwip', district: 'Nadia' },
      { id: 'medinipur', name: 'Medinipur', district: 'Paschim Medinipur' },
      { id: 'jalpaiguri', name: 'Jalpaiguri', district: 'Jalpaiguri' },
      { id: 'balurghat', name: 'Balurghat', district: 'Dakshin Dinajpur' },
      { id: 'basirhat', name: 'Basirhat', district: 'North 24 Parganas' },
      { id: 'bankura', name: 'Bankura', district: 'Bankura' },
      { id: 'chakdaha', name: 'Chakdaha', district: 'Nadia' },
      { id: 'darjeeling', name: 'Darjeeling', district: 'Darjeeling' },
      { id: 'alipurduar', name: 'Alipurduar', district: 'Alipurduar' },
      { id: 'purulia', name: 'Purulia', district: 'Purulia' },
      { id: 'jangipur', name: 'Jangipur', district: 'Murshidabad' },
      { id: 'bolpur', name: 'Bolpur', district: 'Birbhum' },
      { id: 'bangaon', name: 'Bangaon', district: 'North 24 Parganas' },
      { id: 'cooch_behar', name: 'Cooch Behar', district: 'Cooch Behar' },
      { id: 'barrackpore', name: 'Barrackpore', district: 'North 24 Parganas' },
      { id: 'serampore', name: 'Serampore', district: 'Hooghly' },
      { id: 'bhatpara', name: 'Bhatpara', district: 'North 24 Parganas' },
      { id: 'garhbeta', name: 'Garhbeta', district: 'Paschim Medinipur' },
      { id: 'lalbagh', name: 'Lalbagh', district: 'Murshidabad' },
      { id: 'murshidabad', name: 'Murshidabad', district: 'Murshidabad' },
      { id: 'bally', name: 'Bally', district: 'Howrah' },
      { id: 'bidhannagar', name: 'Bidhannagar', district: 'North 24 Parganas' },
      { id: 'chinsurah', name: 'Chinsurah', district: 'Hooghly' },
      { id: 'dum_dum', name: 'Dum Dum', district: 'North 24 Parganas' },
      { id: 'english_bazar', name: 'English Bazar', district: 'Malda' },
      { id: 'hugli', name: 'Hugli-Chuchura', district: 'Hooghly' }
    ]
  },

  // Union Territories (8)
  {
    id: 'andaman_nicobar',
    name: 'Andaman and Nicobar Islands',
    type: 'union_territory',
    cities: [
      { id: 'port_blair', name: 'Port Blair', district: 'South Andaman' },
      { id: 'car_nicobar', name: 'Car Nicobar', district: 'Nicobar' },
      { id: 'mayabunder', name: 'Mayabunder', district: 'North and Middle Andaman' },
      { id: 'diglipur', name: 'Diglipur', district: 'North and Middle Andaman' },
      { id: 'rangat', name: 'Rangat', district: 'North and Middle Andaman' },
      { id: 'baratang', name: 'Baratang', district: 'North and Middle Andaman' }
    ]
  },
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    type: 'union_territory',
    cities: [
      { id: 'chandigarh_city', name: 'Chandigarh', district: 'Chandigarh' }
    ]
  },
  {
    id: 'dadra_nagar_haveli_daman_diu',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'union_territory',
    cities: [
      { id: 'daman', name: 'Daman', district: 'Daman' },
      { id: 'diu', name: 'Diu', district: 'Diu' },
      { id: 'silvassa', name: 'Silvassa', district: 'Dadra and Nagar Haveli' },
      { id: 'dadra', name: 'Dadra', district: 'Dadra and Nagar Haveli' },
      { id: 'nani_daman', name: 'Nani Daman', district: 'Daman' }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    type: 'union_territory',
    cities: [
      { id: 'new_delhi', name: 'New Delhi', district: 'New Delhi' },
      { id: 'north_delhi', name: 'North Delhi', district: 'North Delhi' },
      { id: 'south_delhi', name: 'South Delhi', district: 'South Delhi' },
      { id: 'east_delhi', name: 'East Delhi', district: 'East Delhi' },
      { id: 'west_delhi', name: 'West Delhi', district: 'West Delhi' },
      { id: 'central_delhi', name: 'Central Delhi', district: 'Central Delhi' },
      { id: 'north_west_delhi', name: 'North West Delhi', district: 'North West Delhi' },
      { id: 'north_east_delhi', name: 'North East Delhi', district: 'North East Delhi' },
      { id: 'south_west_delhi', name: 'South West Delhi', district: 'South West Delhi' },
      { id: 'south_east_delhi', name: 'South East Delhi', district: 'South East Delhi' },
      { id: 'shahdara', name: 'Shahdara', district: 'Shahdara' }
    ]
  },
  {
    id: 'jammu_kashmir',
    name: 'Jammu and Kashmir',
    type: 'union_territory',
    cities: [
      { id: 'srinagar', name: 'Srinagar', district: 'Srinagar' },
      { id: 'jammu', name: 'Jammu', district: 'Jammu' },
      { id: 'anantnag', name: 'Anantnag', district: 'Anantnag' },
      { id: 'baramulla', name: 'Baramulla', district: 'Baramulla' },
      { id: 'sopore', name: 'Sopore', district: 'Baramulla' },
      { id: 'kathua', name: 'Kathua', district: 'Kathua' },
      { id: 'udhampur', name: 'Udhampur', district: 'Udhampur' },
      { id: 'punch', name: 'Punch', district: 'Poonch' }
    ]
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    type: 'union_territory',
    cities: [
      { id: 'leh', name: 'Leh', district: 'Leh' },
      { id: 'kargil', name: 'Kargil', district: 'Kargil' },
      { id: 'drass', name: 'Drass', district: 'Kargil' },
      { id: 'nubra', name: 'Nubra', district: 'Leh' }
    ]
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep',
    type: 'union_territory',
    cities: [
      { id: 'kavaratti', name: 'Kavaratti', district: 'Lakshadweep' },
      { id: 'agatti', name: 'Agatti', district: 'Lakshadweep' },
      { id: 'minicoy', name: 'Minicoy', district: 'Lakshadweep' },
      { id: 'amini', name: 'Amini', district: 'Lakshadweep' },
      { id: 'andrott', name: 'Andrott', district: 'Lakshadweep' }
    ]
  },
  {
    id: 'puducherry',
    name: 'Puducherry',
    type: 'union_territory',
    cities: [
      { id: 'puducherry_city', name: 'Puducherry', district: 'Puducherry' },
      { id: 'karaikal', name: 'Karaikal', district: 'Karaikal' },
      { id: 'mahe', name: 'Mahe', district: 'Mahe' },
      { id: 'yanam', name: 'Yanam', district: 'Yanam' }
    ]
  }
];

// Helper functions for easy access
export const getStateById = (stateId: string): State | undefined => {
  return INDIAN_STATES_CITIES.find(state => state.id === stateId);
};

export const getCitiesByStateId = (stateId: string): City[] => {
  const state = getStateById(stateId);
  return state ? state.cities : [];
};

export const getAllStates = (): State[] => {
  return INDIAN_STATES_CITIES;
};

export const getStatesByType = (type: 'state' | 'union_territory'): State[] => {
  return INDIAN_STATES_CITIES.filter(state => state.type === type);
};

export const searchCitiesByName = (searchTerm: string): City[] => {
  const allCities: City[] = [];
  INDIAN_STATES_CITIES.forEach(state => {
    allCities.push(...state.cities);
  });
  
  return allCities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getStateByCity = (cityId: string): State | undefined => {
  return INDIAN_STATES_CITIES.find(state => 
    state.cities.some(city => city.id === cityId)
  );
};
