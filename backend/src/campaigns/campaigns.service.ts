import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const createdCampaign = new this.campaignModel(createCampaignDto);
    return createdCampaign.save();
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().exec();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findById(id).exec();
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async update(
    id: string,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const updatedCampaign = await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();
    if (!updatedCampaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return updatedCampaign;
  }

  async remove(id: string): Promise<void> {
    const result = await this.campaignModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
  }

  async findByChannelType(channelType: string): Promise<Campaign[]> {
    return this.campaignModel
      .find({ 'messages.channelType': channelType })
      .exec();
  }

  async getChannelLimits() {
    return {
      vkontakte: {
        textMaxLength: 4096,
        standardKeyboard: {
          maxButtons: 40,
          supportsUrlButtons: true,
        },
        inlineKeyboard: {
          maxButtons: 10,
          maxButtonTextLength: null,
          supportsUrlButtons: true,
        },
      },
      whatsapp: {
        textMaxLength: 1000,
        standardKeyboard: {
          maxButtons: 10,
          maxButtonTextLength: 20,
          supportsUrlButtons: false,
        },
        inlineKeyboard: {
          maxButtons: 3,
          maxButtonTextLength: 20,
          supportsUrlButtons: true,
          maxUrlButtons: 1,
        },
      },
      telegram: {
        textMaxLength: 4096,
        standardKeyboard: {
          maxButtons: null,
          supportsUrlButtons: false,
        },
        inlineKeyboard: {
          maxButtons: null,
          maxButtonTextLength: 64,
          supportsUrlButtons: true,
        },
      },
      sms: {
        textMaxLength: null,
        standardKeyboard: {
          supported: false,
        },
        inlineKeyboard: {
          supported: false,
        },
      },
    };
  }
}
