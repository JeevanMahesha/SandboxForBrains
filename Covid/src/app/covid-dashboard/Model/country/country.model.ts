export interface ISelectedCountryDetail {
    ID:          string;
    Country:     string;
    CountryCode: string;
    Province:    string;
    City:        string;
    CityCode:    string;
    Lat:         string;
    Lon:         string;
    Confirmed:   number;
    Deaths:      number;
    Recovered:   number;
    Active:      number;
    Date:        string;
  
           
}

export interface IConfirmData{
    Confirmed:   number;
    Deaths:      number;
    Recovered:   number;
    Active:      number;
}

export interface IAllCountryData {
    ID:             string;
    Country:        string;
    CountryCode:    string;
    Slug:           string;
    NewConfirmed:   number;
    TotalConfirmed: number;
    NewDeaths:      number;
    TotalDeaths:    number;
    NewRecovered:   number;
    TotalRecovered: number;
    Date:           string;
}




