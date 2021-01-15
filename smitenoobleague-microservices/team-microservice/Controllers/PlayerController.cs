﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using team_microservice.Interfaces;
using team_microservice.Models.External;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace team_microservice.Controllers
{
    [Route("[controller]")]
    public class PlayerController : Controller
    {
        private readonly IPlayerService _playerService;

        public PlayerController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        // GET team-service/player/bydivision/{id}
        [HttpGet("bydivision/{divisionID}")]
        public async Task<ActionResult<IEnumerable<PlayerWithTeamInfo>>> Get(int? divisionID)
        {
            return await _playerService.GetPlayersByDivisionIdAsync(divisionID);
        }
    }
}
