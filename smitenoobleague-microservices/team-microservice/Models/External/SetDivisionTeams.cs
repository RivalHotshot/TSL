﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace team_microservice.Models.External
{
    public class SetDivisionTeams
    {
        [Required]
        public int divisionID { get; set; }
        public List<int> teamIdList { get; set; }
    }
}
