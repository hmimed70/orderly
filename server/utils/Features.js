class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
    search() {
      console.log("ddsggd",this.queryStr.keyword)
      const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              "invoice_information.client": {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              "invoice_information.phone1": {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};
     
      const status = this.queryStr.status
      ? { status: this.queryStr.status }
      : {};

      this.query = this.query.find({ ...keyword, ...status });

      return this;
  }
  
    filter() {
        const queryObjects = {...this.queryStr} ;
        const removeFields = [ 'keyword','page', 'sort', 'limit', 'fields', 'date'];
        removeFields.forEach(el=> delete queryObjects[el]);
       let queryStr = JSON.stringify(queryObjects);
       queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
      this.query = this.query.find(JSON.parse(queryStr));  
      return this;
    }
    sort() {
        if (this.queryStr.sort) {
          const sortBy = this.queryStr.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
        } else {
          this.query = this.query.sort('-createdAt');
        }

        return this;
      }
      limitFields() {
        if(this.queryStr.fields) {
            const filteredFields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(filteredFields)
          }else {
            this.query = this.query.select('-__v');
          }
       return this;    
      }
    pagination(resultPerPage) {
    
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);
    
        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
  }
  
  module.exports = ApiFeatures;
  