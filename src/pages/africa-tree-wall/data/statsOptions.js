const cols = {
    "mortalityrate": {
        "label": "Mortality Rate",
        "type": "number",
        "format": ".0f",
        "title": "Mortality rate, under-5 (per 1,000 live births)",
        "latestyear": "2016",
        "url": "http://www.childmortality.org/",
        "source": "childmortality.org",
        "description": "Estimates Developed by the UN Inter-agency Group for Child Mortality Estimation ( UNICEF, WHO, World Bank, UN DESA Population Division ). Projected data are from the United Nations Population Division's World Population Prospects; and may in some cases not be consistent with data before the current year."
    },
    "dyingyoung": {
        "label": "Probability Dying Young",
        "type": "percentage",
        "format": ".1%",
        "title": "Probability of dying at age 5-14 years (per 1,000 children age 5)",
        "latestyear": "2016",
        "url": "http://www.childmortality.org/",
        "source": "childmortality.org",
        "description": "Estimates Developed by the UN Inter-agency Group for Child Mortality Estimation ( UNICEF, WHO, World Bank, UN DESA Population Division )"
    }
}

export default cols;