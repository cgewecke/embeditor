angular
  .module('yt.search.mockdata', [
  ])

   .controller('query', function(){

      this.response = {
         taylor_relev_any_page1 :,
         taylor_relev_any_page2 :,
         taylor_date_any_page1 :,
         taylor_date_any_page2 :,
         taylor_relev_short_page1 :,
         taylor_relev_short_page2 :,
         taylor_relev_long_page1 :,
      };

      this.output = {

         taylor_relev_any_page1 :,
         taylor_relev_any_page2 :,
         taylor_date_any_page1 :,
         taylor_date_any_page2 :,
         taylor_relev_short_page1 :,
         taylor_relev_short_page2 :,
         taylor_relev_long_page1 :,
      };
   })

   .controller('channel', function(){
      this.response ={
         yale_relev_any_page1:,
         yale_relev_any_page2:,
      };

      this.output = {
         yale_relev_any_page1:,
         yale_relev_any_page2:,
      };

   })

   .controller('related', function(){
      this.shakeRelated_rel_any_page1 =
      this.shakeRelated_rel_any_page2 =
   })