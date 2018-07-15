using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AE.Models;

namespace AE.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }
        [HttpGet]
        public JsonResult CreateResult()
        {
            Dictionary<String, int> Fruits = new Dictionary<string,int>();
            Fruits.Add("Apple",5);
            Fruits.Add("Pineapple", 40);
            Fruits.Add("Banana", 9);
            Fruits.Add("Orange", 14);
            Fruits.Add("Chestnuts", 25);
            Fruits.Add("Cherry", 12);
            return new JsonResult(new { Fruits});
        }
       
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
